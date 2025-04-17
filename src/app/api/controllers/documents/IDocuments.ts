export interface Document {
    id: number;
    name: string;
    data?: Buffer; // Опционально, так как в списке документов данные не нужны
    otdel_id: number;
}