


export interface News {
    news_id: number;
    title: string;
    text: string;
    date: string;
    photos: { url: string, caption?: string }[];
}