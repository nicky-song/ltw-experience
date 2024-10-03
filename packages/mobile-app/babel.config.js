module.exports = function (api) {
    const isTest = api.env('test');

    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            ...(isTest
                ? []
                : [
                      'add-react-displayname',
                      '../../node_modules/@heap/react-native-heap/instrumentor/src/index.js',
                  ]),
            ['import', { libraryName: '@ant-design/react-native' }],
        ],
    };
};
