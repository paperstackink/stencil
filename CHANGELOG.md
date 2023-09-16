# Changelog

All notable changes to this project will be documented in this file.

## [0.4.0] - 2023-08-30

### Fixed

-   Fixed an issue where void components (`<Card />`) would swallow all following sibling nodes
-   Fixed an issue where void slots (`<slot />`) would swallow all following sibling nodes
-   Fixed an issue with leaky scopes in nested components

### Added

-   Added support for dynamic component names: `<Component is="Card" />`
-   Added support for binding a record as attributes on a component: `<Component is="Card" #bind="$record" />`
-   Added support for recursive components
-   Added global `dump()` function
-   Added `filterBy()` method on records
-   Added `$attributes` record inside components

## [0.3.0] - 2023-08-10

### Fixed

-   Fixed a bug that caused infinite loops when using a slot inside a slot of another component

### Added

-   Added new 'Record' data type
-   Added property access
-   Added functions
-   Added Data components
-   Added 'extractData' method

## [0.2.0] - 2023-07-09

### Added

-   Added support for @if directive
