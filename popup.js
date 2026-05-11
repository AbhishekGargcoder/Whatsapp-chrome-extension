const toggleBlur = document.getElementById('toggle-blur');
const blurIntensity = document.getElementById('blur-intensity');
const intensityDisplay = document.getElementById('intensity-display');

// Load saved settings
chrome.storage.local.get(['isBlurEnabled', 'intensity'], (result) => {
    if (result.isBlurEnabled !== undefined) {
        toggleBlur.checked = result.isBlurEnabled;
    }
    if (result.intensity !== undefined) {
        blurIntensity.value = result.intensity;
        intensityDisplay.textContent = `${result.intensity}px`;
    }
});

// Update settings and notify content script
function updateSettings() {
    const isEnabled = toggleBlur.checked;
    const intensity = blurIntensity.value;
    
    intensityDisplay.textContent = `${intensity}px`;
    
    chrome.storage.local.set({ 
        isBlurEnabled: isEnabled, 
        intensity: parseInt(intensity) 
    });

    // Notify all WhatsApp tabs
    chrome.tabs.query({ url: ["https://web.whatsapp.com/*", "https://*.whatsapp.com/*"] }, (tabs) => {
        if (tabs.length === 0) {
            console.warn("No WhatsApp tabs found. Please make sure WhatsApp Web is open and active.");
        }
        console.log(`Found ${tabs.length} WhatsApp tabs`);
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
                type: 'UPDATE_SETTINGS',
                isEnabled: isEnabled,
                intensity: parseInt(intensity)
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error(`Error sending message to tab ${tab.id}:`, chrome.runtime.lastError.message);
                } else {
                    console.log(`Successfully updated tab ${tab.id}`);
                }
            });
        });
    });
}

toggleBlur.addEventListener('change', updateSettings);
blurIntensity.addEventListener('input', updateSettings);