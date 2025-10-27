export interface IPersonality {
    id?: string,
    name: string, 
    type: string, 
    short_description: string,
    long_description: string,
}

export interface ICharacter {
    name: string, 
    details: string,
    personality: string,
}