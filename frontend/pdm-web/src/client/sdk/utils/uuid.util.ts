const _p8 = (s?: boolean) => {
    var p = (Math.random().toString(16) + "000000000").substr(2, 8);
    return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
}

export class UUIDUtil {
    static generateID() {
        return this.new();
    }

    static new() {
        return _p8() + _p8(true) + _p8(true) + _p8();
    }

	static empty() {
        return '00000000-0000-0000-0000-000000000000';
    }
}
