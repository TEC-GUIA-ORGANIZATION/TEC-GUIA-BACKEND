import express, { Router, Application } from 'express';
import path from 'path';

interface Options {
    port: number;
    routes: Router;
    public_path?: string;
}

export class Server {
    private app: Application = express();
    private readonly port: number;   
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: Options) {
        const { port, routes, public_path = 'public' } = options;
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes;
    }

    async start() {

        //* Middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded( {extended:true} )); // x-www-form-urlencoded
        // this.app.use((req: Request, res: Response, next: NextFunction) => {
        //     res.status(200).send("Status Working");
        //     next();
        // });

        //* Public Folder
        this.app.use(express.static(this.publicPath));

        //* Routes
        this.app.use(this.routes);

        //* SPA
        this.app.get('*', (req, res) => {
            const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
            res.sendFile(indexPath);
        })


        this.app.listen(this.port, () => {
            console.log(`server running on port ${this.port}`);
        })
    }
}