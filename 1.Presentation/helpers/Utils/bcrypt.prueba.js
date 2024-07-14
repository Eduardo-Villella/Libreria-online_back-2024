// Archivo script para probar que el entorno permite el uso de bcrypt (escritura, lectura sin conflictos)

const bcrypt = require('bcrypt');

async function testBcrypt() {
    const password = 'testpassword';
    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('Hashed Password:', hashedPassword);

        const isMatch = await bcrypt.compare(password, hashedPassword);
        console.log('Password Match:', isMatch);
        
    } catch (error) {
        console.error('Error with bcrypt:', error);
    }
    
}


testBcrypt();

