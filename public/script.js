let statusInterval;
let currentStatus = 'disconnected';

function updateStatus() {
    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            const statusElement = document.getElementById('statusText');
            const indicatorElement = document.getElementById('statusIndicator');
            const qrContainer = document.getElementById('qrContainer');
            const qrPlaceholder = document.getElementById('qrPlaceholder');
            
            currentStatus = data.status;
            
            // Mise à jour du texte de statut
            if (data.status === 'connected') {
                statusElement.textContent = 'Connecté ✓';
                indicatorElement.className = 'status-indicator status-connected';
                if (qrContainer) {
                    qrContainer.innerHTML = '<div class="qr-placeholder"><p>✅ Connecté à WhatsApp</p><p class="success-message">Bot prêt à être utilisé !</p></div>';
                }
            } 
            else if (data.status === 'qr') {
                statusElement.textContent = 'QR Code disponible';
                indicatorElement.className = 'status-indicator status-qr';
                
                // Afficher le QR code s'il existe
                if (data.qr) {
                    qrContainer.innerHTML = `<img src="${data.qr}" alt="QR Code WhatsApp" class="qr-code">`;
                    
                    // Ajouter un message d'instruction
                    const instruction = document.createElement('p');
                    instruction.className = 'scan-instruction';
                    instruction.innerHTML = '📱 Scannez ce QR code avec WhatsApp > Menu > Appareils connectés';
                    qrContainer.appendChild(instruction);
                } else {
                    qrContainer.innerHTML = '<div class="qr-placeholder"><p>⏳ Génération du QR code...</p><div class="loader"></div></div>';
                }
            } 
            else {
                statusElement.textContent = 'Déconnecté ✗';
                indicatorElement.className = 'status-indicator status-disconnected';
                qrContainer.innerHTML = '<div class="qr-placeholder"><p>📱 Cliquez sur "Connexion" pour générer le QR code</p></div>';
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            document.getElementById('statusText').textContent = 'Erreur de connexion';
        });
}

function connect() {
    fetch('/api/connect')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Connexion initiée... Génération du QR code', 'success');
                // Attendre un peu que le QR soit généré
                setTimeout(updateStatus, 2000);
            }
        })
        .catch(error => {
            showNotification('Erreur de connexion au serveur', 'error');
        });
}

function disconnect() {
    if (confirm('Voulez-vous vraiment déconnecter le bot ?')) {
        fetch('/api/disconnect')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Déconnecté avec succès', 'success');
                    updateStatus();
                }
            })
            .catch(error => {
                showNotification('Erreur lors de la déconnexion', 'error');
            });
    }
}

function refreshQR() {
    if (currentStatus === 'disconnected') {
        connect();
    } else if (currentStatus === 'qr') {
        // Forcer la régénération du QR
        disconnect();
        setTimeout(() => {
            connect();
        }, 2000);
    } else {
        showNotification('Déjà connecté', 'info');
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '10px';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideInRight 0.3s ease-out';
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Démarrer la mise à jour périodique
updateStatus();
statusInterval = setInterval(updateStatus, 3000);

// Nettoyer l'intervalle quand on quitte la page
window.addEventListener('beforeunload', () => {
    if (statusInterval) {
        clearInterval(statusInterval);
    }
});
