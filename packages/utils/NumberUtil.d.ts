export declare class NumberUtil {
    static defaultDigits: number;
    static setDigits(digits: any): void;
    static add(a: number, b: number): number;
    static sub(a: number, b: number): number;
    static fixedNumUp(num: number, digits?: number): number;
    /**
     * 判断数字是否接近0
     * @param {number} a
     * @returns {boolean}
     */
    static closeToZero(a: number): boolean;
    /**
     * 四舍五入
     * 1. 为什么不用 toFixed ？toFixed return string 这个方法 return number
     * 2. 为什么不用 Math.round ？不支持指定小数位
     * @param num
     * @param digits 默认2
     * @returns {number}
     */
    static fixedNum(num: number, digits?: number): number;
    /**
     * 修复 0.1 + 0.2 = 0.30000000000000004 的这类数字
     * @param {number} num
     * @returns {number}
     */
    static fixNumPrecision(num: number): number;
    /**
     * 遍历 Object 的属性，找出所有 number 类型的属性并 fixNumPrecision
     * @param {object} obj
     * @returns object
     */
    static fixObj<T extends object>(obj: T): T;
    /**
     * 截取 digits 位小数 不做四舍五入
     * @param num
     * @param digits
     * @returns {number}
     */
    static cutNum(num: number, digits?: number): number;
}
