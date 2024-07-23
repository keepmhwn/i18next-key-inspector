# i18next-key-inspector

i18next-key-inspector is a tool that reads JSON-format translation files written for multilingual support to inspect if each locale has the same keys.

## Getting started

### Installation

```shell
$ npm install --save-dev i18next-key-inspector
```

### i18next-key-inspector.config.json

To compare the keys in translated JSON files using i18next-key-inspector, you must have the `i18next-key-inspector.config.json` file. You can create a config file at the top level of your project and write it like the example file below.

```json
{
  "basePath": "./public/locales",
  "source": "en",
  "locales": ["ko", "fr", "de"]
}
```

- `basePath`: This is the default path where the translation files for each locale are located. In the example above, JSON-format translation files are located under the path "./public/locales/en".
- `source`: This is the source locale. The translation files of other locales are inspect against the source locale.
- `locales`: This is the list of locales to compare with the source locale's translation files.

### Execution

- `package.json`

```json
"scripts": {
    "inspect": "inspect-locale-key"
  },
```

## License

[MIT License](https://github.com/kimmihi/i18next-key-inspector/blob/main/LICENSE)
