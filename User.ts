export class User {
    public static usersDB: User[] = [];

    public id: number = 0;
    public name: string = "";
    public password: string = "";
    public isActive: boolean = true;


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
                let responseText = await response.json();
                console.log(responseText);
            } else {
                let data: any = await response.json();
                console.log(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    static async fetchUsers(): Promise<void> {
        try {
            const response = await fetch('https://lavida-server.vercel.app/api/get_users');
            let usersFetched: User[] = await response.json() as User[];
            let increment: number = 0;
            usersFetched.forEach((userDB: any) => {
                User.usersDB[increment] = new User(userDB.id, userDB.name, userDB.password, userDB.isactive);
                increment++;
            });
        } catch (error) {
            console.error('Error fetching users:', error);

        }
    }

}
