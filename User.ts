export class User {

    public id: number = 0;
    public name: string = "";
    public password: string = "";
    public isActive: boolean = true;
    public socketID: string = "";


    constructor(_id: number, _name: string, _password: string, _isActive: boolean) {
        this.id = _id;
        this.name = _name;
        this.password = _password;
        this.isActive = _isActive;
    }


    static async update_user_active(username: string, isActive: boolean): Promise<void> {
        try {
            const requestBody = {
                name: username,
                isActive: isActive,
            };
            let response = await fetch('https://lavida-server.vercel.app/api/update_user_active', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            if (response.status === 200) {
                await response.json();
            } else {
                await response.json();
            }
        } catch (error) {
        }
    }

    static async fetchUsers(): Promise<User[]> {
        try {
            const response = await fetch('https://lavida-server.vercel.app/api/get_users');
            let usersFetched: User[] = await response.json() as User[];
            return usersFetched;
        } catch (error) {
            return null as unknown as User[];
        }
    }
}
