import GameData from "@/types/GameData";

function isGameData(data: unknown): data is GameData {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;

    return (
        typeof obj.resultDescription === 'string' &&
        Array.isArray(obj.availablePlaces) &&
        typeof obj.invitationCode === 'string' &&
        Array.isArray(obj.players) &&
        typeof obj.roles === 'object' &&
        typeof obj.spy === 'object' &&

        (obj.votes ? typeof obj.votes === 'object' : true) &&
        (obj.finalVotes ? typeof obj.finalVotes === 'object' : true) &&
        (obj.nominator ? typeof obj.nominator === 'string' : true) &&
        (obj.nominee ? typeof obj.nominee === 'string' : true)
    );
}

export default isGameData;