require('dotenv').config();
const app = require('./app');
const prisma = require('./config/database');

const PORT = process.env.PORT || 3000;

async function main() {

    await prisma.$connect();
    console.log("✅ Database Connected");
    
    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
}

main().catch((err)=>{
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});