class AbstractInternal {

    constructor(test, use) {
        this.test = test;
        this.use = use || [];
        this.base = {};
    }

    buildModuleRule(Loader) {
        return Object.assign(this.base, {
            test: this.buildTest(),
            use: this.buildUse(),
        });
    }

    buildTest() {
        return this.test;
    }

    buildUse() {
        return this.use;
    }

}

module.exports = AbstractInternal;