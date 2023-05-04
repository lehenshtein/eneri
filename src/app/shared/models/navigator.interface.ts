export interface NavigatorInterface {
  screenSize: { width: string | number, height: string | number },
  browser: string,
  browserVersion: string,
  browserMajorVersion: number,
  mobile: boolean,
  os: string,
  osVersion: string | null | RegExpExecArray,
  cookieEnabled: boolean,
  position: string | null,
  languages: readonly string[]
}
