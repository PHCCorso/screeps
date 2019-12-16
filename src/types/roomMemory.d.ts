import { CreepRole } from '../constants/creep';

interface RoomMemory {
    constructionSite: ConstructionSite[];
    container: StructureContainer[];
    creep: { [key in CreepRole]: Creep[] };
    damagedStructure: Structure[];
    extension: StructureExtension[];
    hostile: (OwnedStructure | Creep | PowerCreep)[];
    owned: boolean;
    rampart: StructureRampart[];
    ruin: { id: number; store: Store };
    source: Source[];
    tombstone: Tombstone;
    tower: StructureTower[];
    wall: StructureWall[];
}
