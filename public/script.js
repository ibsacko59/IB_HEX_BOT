let statusInterval;
let currentStatus = 'disconnected';

function updateStatus() {
    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            const statusElement = document.getElementById('statusText');
            const indicatorElement = document.getElementById('statusIndicator');
            const qrContainer = document.getElementById('qrContainer');
            
            currentStatus = data.status;
            
            // Mise à jour du texte de statut
            if (data.status === 'connected') {
                statusElement.textContent = 'Connecté';
                indicatorElement.className = 'status-indicator status-connected';
                qrContainer.innerHTML = '<div class="qr-placeholder"><p>✅ Connecté à WhatsApp</p></div>';
            } else if (data.status === 'qr') {
                statusElement.textContent = 'QR Code disponible';
                indicatorElement.className = 'status-indicator status-qr';
                if (data.qr) {
                    qrContainer.innerHTML = `<img src="${data.qr}" alt="QR Code" class="qr-code">`;
                }
            } else {
                statusElement.textContent = 'Déconnecté';
                indicatorElement.className = 'status-indicator status-disconnected';
                qrContainer.innerHTML = '<div class="qr-placeholder"><p>📱 Scanner le QR Code pour connecter</p></div>';
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
}

function connect() {
    fetch('/api/connect')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Connexion initiée...', 'success');
            }
        })
        .catch(error => {
            showNotification('Erreur de connexion', 'error');
        });
}

function disconnect() {
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

function refreshQR() {
    if (currentStatus === 'disconnected') {
        connect();
    } else {
        showNotification('Déjà connecté ou en cours', 'warning');
    }
}

function showNotification(message, type) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style de la notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '10px';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideInRight 0.3s ease-out';
    
    // Couleurs selon le type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
    }
    
    document.body.appendChild(notification);
    
    // Animation de sortie
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Démarrer la mise à jour périodique
updateStatus();
statusInterval = setInterval(updateStatus, 3000);

// Nettoyer l'intervalle quand on quitte la page
window.addEventListener('beforeunload', () => {
    if (statusInterval) {
        clearInterval(statusInterval);
    }
});
