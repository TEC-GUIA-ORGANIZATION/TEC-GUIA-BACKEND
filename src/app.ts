import { envs } from "./config/envs";
import { Server } from "./presentation/server";
import { AppRoutes } from "./presentation/routes";
import { MongoDatabase } from "./data/mongo/init";

(async()=> {
    main();
})();

async function main() {

    await MongoDatabase.connect({
        mongoUrl: envs.MONGO_URI(),
        // dbName: envs.MONGO_DB_NAME(),
    });
    
    const server = new Server(
        {
            port: envs.PORT,
            public_path: envs.PUBLIC_PATH,
            routes: AppRoutes.routes,
        });

    server.start();
}