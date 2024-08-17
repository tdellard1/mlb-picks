import {addToCache, getFromCache, replaceInCache} from "../../services/cache.service.js";

const key: string = 'clients';

export async function setNeedToUpdate() {
    const clients: string[] = await getClientNames();
    const updateClients: ClientUpdate[] = clients.map((client: string) => new ClientUpdate({client, update: true}));
    const updateClientsResponse: number = await replaceInCache(key, updateClients.map((clientUpdate: ClientUpdate) => JSON.stringify(clientUpdate)));
    console.log('updateClientsResponse: ', updateClientsResponse);
}

export async function addClient(ipAddress: string): Promise<number> {
    const client: ClientUpdate = new ClientUpdate({
        client: ipAddress,
        update: false
    });

    return await addToCache(key, JSON.stringify(client));
}

export async function getClientNames() {
    const clients: ClientUpdate[] = await getFromCache(key, ClientUpdate, 'set');
    return clients.map(({client}) => client);
}

export async function getClientUpdateStatus(clientName: string): Promise<boolean> {
    const clients: ClientUpdate[] = await getFromCache(key, ClientUpdate, 'set');
    return clients.find(({client}) => client === clientName)!.update;
}

export async function updateClient(clientName: string, update: boolean): Promise<number> {
    const clients: ClientUpdate[] = await getFromCache(key, ClientUpdate, 'set');
    const clientIndex: number = clients.findIndex(({client}) => client === clientName);

    if (clientIndex !== -1) {
        clients[clientIndex].update = update
    } else {
        clients.push(new ClientUpdate({client: clientName, update}));
    }

    return await replaceInCache(key,clients.map(client => JSON.stringify(client)));
}

export class ClientUpdate {
    client: string;
    update: boolean;

    constructor(data: any) {
        this.client = data.client;
        this.update = data.update;
    }
}