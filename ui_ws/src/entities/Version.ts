export interface VersionInfo {
    version: string,
    upgrade_from: string,
    state: string,
    started_at: string,
    finished_at: string,
    builded_at: string
}

export interface Versions {
    total: number,
    page: number,
    size: number,
    versions: Array<VersionInfo>
}