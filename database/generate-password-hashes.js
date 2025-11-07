// Script to generate bcrypt password hashes for DisasterWatch accounts
// Run this script to generate hashes for the SQL schema

const bcrypt = require('bcrypt');

const accounts = [
    { username: 'admin', password: 'admin123' },
    { username: 'coordinator_butuan', password: 'butuan123' },
    { username: 'coordinator_agusan_norte', password: 'agusan_norte123' },
    { username: 'coordinator_surigao_sur', password: 'surigao_sur123' },
    { username: 'coordinator_agusan_sur', password: 'agusan_sur123' },
    { username: 'coordinator_cabadbaran', password: 'cabadbaran123' }
];

async function generateHashes() {
    console.log('Generating bcrypt password hashes...\n');
    
    for (const account of accounts) {
        try {
            const hash = await bcrypt.hash(account.password, 10);
            console.log(`Username: ${account.username}`);
            console.log(`Password: ${account.password}`);
            console.log(`Hash: ${hash}`);
            console.log('---');
        } catch (error) {
            console.error(`Error hashing password for ${account.username}:`, error);
        }
    }
}

generateHashes();
