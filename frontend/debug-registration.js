// Script de debug pour tester l'inscription
// À exécuter dans la console du navigateur sur http://localhost:3000

async function testRegistration() {
    console.log('🧪 Test d\'inscription...');
    
    const testUser = {
        email: 'debug.test@example.com',
        password: 'testpass123',
        first_name: 'Debug',
        last_name: 'Test',
        adresse: '123 Debug Street',
        gender: 'M',
        user_role: 'client'
    };
    
    try {
        const response = await fetch('http://localhost:8000/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(testUser)
        });
        
        console.log('Status:', response.status);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('Response Text:', responseText);
        
        if (response.ok) {
            const data = JSON.parse(responseText);
            console.log('✅ Inscription réussie:', data);
        } else {
            console.log('❌ Erreur d\'inscription:', responseText);
            
            // Try to parse as JSON
            try {
                const errorData = JSON.parse(responseText);
                console.log('Détails de l\'erreur:', errorData);
            } catch (e) {
                console.log('Impossible de parser l\'erreur comme JSON');
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur réseau:', error);
    }
}

// Exécuter le test
testRegistration();
