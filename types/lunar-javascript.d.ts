declare module "lunar-javascript" {
  export const Solar: {
    fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): {
      getLunar(): {
        getEightChar(): {
          getYearGan(): string;
          getYearZhi(): string;
          getMonthGan(): string;
          getMonthZhi(): string;
          getDayGan(): string;
          getDayZhi(): string;
          getTimeGan(): string;
          getTimeZhi(): string;
        };
        getBaZiShiShenGan(): string[];
        getBaZiShiShenZhi(): string[];
      };
    };
  };
}
