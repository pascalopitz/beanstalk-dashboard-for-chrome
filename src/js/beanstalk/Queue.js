import nodestalker from 'nodestalker';

import events from '../events';

class Queue {

    constructor (connection) {

        if(connection.port) {
            connection.port = parseInt(connection.port, 10);
        }

        this.client = nodestalker.Client(connection);

        this.client.on('error', (err) => {
            events.emit('connection-error');
        });

        this.client.on('connect', (address) => {
            events.emit('connection-success');
        });
    }

    list_tubes () :Promise {
        return new Promise((resolve, reject) => {
            this.client.list_tubes().onSuccess((data) => {
                resolve(data)
            }, (data) => {
                reject(data)
            });
        });
    }

    pause_tube (tube: string, delay: number) :Promise {
        return new Promise((resolve, reject) => {
            this.client.pause_tube(tube, delay).onSuccess((data) => {
                resolve(data)
            }, (data) => {
                reject(data)
            });
        });
    }

    stats_tube (tube: string) :Promise {
        return new Promise((resolve, reject) => {
            this.client.stats_tube(tube).onSuccess((data) => {
                resolve(data)
            }, (data) => {
                reject(data)
            });
        });
    }

    stats_job (job: number) :Promise {
        return new Promise((resolve, reject) => {
            this.client.stats_job(job).onSuccess((data) => {
                resolve(data)
            }, (data) => {
                reject(data)
            });
        });
    }

    ignore (tube: string) :Promise {
        return new Promise((resolve, reject) => {
            this.client.ignore(tube).onSuccess((data) => {
                resolve(data)
            }, (data) => {
                reject(data)
            });
        });
    }

    kick (tube: string, count: number) :Promise {
        return new Promise((resolve, reject) => {
            this.client.kick(tube, count).onSuccess((data) => {
                resolve(data)
            }, (data) => {
                reject(data)
            });
        });
    }

    peek (id: number) :Promise {
        return new Promise((resolve, reject) => {
            this.client.peek(id).onSuccess((data) => {
                resolve(data)
            }, (data) => {
                reject(data)
            });
        });
    }

    peek_buried () :Promise {
        return new Promise((resolve, reject) => {
            this.client.peek_buried().onSuccess((data) => {
                resolve(data)
            }, (data) => {
                reject(data)
            });
        });
    }

    peek_delayed () :Promise {
        return new Promise((resolve, reject) => {
            this.client.peek_delayed().onSuccess((data) => {
                resolve(data)
            }, (data) => {
                reject(data)
            });
        });
    }

    peek_ready () :Promise {
        return new Promise((resolve, reject) => {
            this.client.peek_ready().onSuccess((data) => {
                resolve(data)
            }, (data) => {
                reject(data)
            });
        });
    }

    watch (tube: string) :Promise {
        return new Promise((resolve, reject) => {
            this.client.watch(tube).onSuccess((data) => {
                resolve(data)
            }, (data) => {
                reject(data)
            });
        });
    }

    watchOnly (tube: string) :Promise {
        let p = this.watch(tube);

        if(tube !== 'default') {
            p.then(() => {
                return this.ignore('default')
            });
        }
    
        return p;
    }

    reserve () :Promise {
        return new Promise((resolve, reject) => {
            this.client.reserve().onSuccess((job) => {
                resolve(job);
            });
        });
    }

    release (id: number, priority: number, delay: number) :Promise {
        return new Promise((resolve, reject) => {
            this.client.release(id, priority, delay).onSuccess((job) => {
                resolve(job);
            });
        });
    }

    deleteJob (id: number) :Promise {
        return new Promise((resolve, reject) => {
            this.client.deleteJob(id).onEnd((data) => {
                resolve()
            }, (data) => {
                reject(data)
            });
        });
    }

    bury (id: number, priority: number) :Promise {
        return new Promise((resolve, reject) => {
            this.client.bury(id, priority).onSuccess((job) => {
                resolve();
            });
        });
    }

    use (tube: string) :Promise {
        return new Promise((resolve, reject) => {
            this.client.use(tube).onEnd((data) => {
                resolve()
            }, (data) => {
                reject(data)
            });
        });
    }

    put (data: string, priority: number, delay: number, ttr: number) :Promise {
        return new Promise((resolve, reject) => {
            this.client.put(data, priority, delay, ttr).onEnd((data) => {
                resolve()
            }, (data) => {
                reject(data)
            });
        });
    }

    disconnect () :Promise {
        return new Promise((resolve, reject) => {
            this.client.disconnect();
            resolve();
        });
    }
}

export default Queue;
