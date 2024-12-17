// Load links from images2.csv


async function loadLinks() {
    const response = await fetch('images2.csv');
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines;
}

let imgurLinks = [];

// Initialize links and event listener
loadLinks().then(links => {
    imgurLinks = links;
    document.getElementById('fabio-button').addEventListener('click', () => {
        if (imgurLinks.length > 0) {
            // Select a random link
            const randomLink = imgurLinks[Math.floor(Math.random() * imgurLinks.length)];
            
            // Construct Imgur link and image
            const imgurPageLink = `https://imgur.com/${randomLink}`;
            const imgurImageLink = `https://i.imgur.com/${randomLink}.png`;
            
            // Display the link and image
            const container = document.getElementById('fabio-container');
            container.innerHTML = `<a href="${imgurPageLink}" target="_blank">
                <img src="${imgurImageLink}" title="source: imgur.com" />
            </a>`;
        } else {
            alert('No links found. Make sure images2.csv is loaded correctly.');
        }
    });
});

// Handle SMS-style chat input and send to backend
async function sendMessage(userInput) {
    try {
        const response = await fetch('https://faabio.onrender.com/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: userInput
            })
        });

        if (response.ok) {
            const data = await response.json();
            const responseContainer = document.getElementById('response-container');
            responseContainer.textContent = data.message || 'No response received.';
        } else {
            console.error('Server responded with an error:', response.status);
            alert('Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error communicating with the server.');
    }
}

document.getElementById('send-button').addEventListener('click', () => {
    const userInput = document.getElementById('sms-input').value.trim();

    if (userInput.length === 0) {
        alert('Please enter a message before sending.');
        return;
    }
    if (userInput.length > 300) {
        alert('Message exceeds 300 character limit.');
        return;
    }

    sendMessage(userInput);
});
