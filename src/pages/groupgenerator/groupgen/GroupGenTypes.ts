export interface Names {
    id: string;
    name: string;
}

export interface Group {
    id: string;
    names: Names[];
}


export interface GroupArrangement {
    id: string;
    groups: Group[];
}


export interface Class {
    id: string;
    name: string;
    people: Names[];
    absentPeopleIds: string[];
}