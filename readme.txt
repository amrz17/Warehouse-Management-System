How to install to spesicif package : 
npm i --workspace nama_folder @nestjs/serve-static

How to connect PostgreSql to Nest :
1. npm i pg typeorm @nestjs/typeorm
2. npm install @nestjs/config

install class validator & class transformer:
npm i --workspace api class-validator class-transformer

install for hash : 
npm i --workspace api bcryipt

install for jwt token : 
npm i --workspace api jsonwebtoken @nestjs/config

migration database cmd : 
npm run db:drop --workspace api 
npm run migration:generate --name=namaPerubahannya --workspace api  
npm run migration:run --workspace api 

seed master data : 
npm run seed --workspace api