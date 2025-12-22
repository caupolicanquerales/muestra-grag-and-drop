export interface ServerSentEvent<T> {

    id: string;
    event: string;
    comment: string;
    data: T;
}
