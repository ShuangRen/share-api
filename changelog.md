# CHANGE LOG

## VERSION 1.1.0

1. **Support for secondary path**

* In some cases, you need to use `www.example.com/scopePath` to access, instead of directly accessing the domain name `www.example.com`
* Now `scopePath` is a configurable item

2. **Rewritten the `setting` related code, the form validation is completely taken over by antd**

3. **Added `enablePrivate` configuration, which is disabled by default. When enabled, it will enable the distinction between private and non-private interfaces.**

* Some switches do not require private configuration by switching on and off the switch that controls the private configuration.
* The previous design caused the use to be too complicated. If no IP whitelist is configured, you need to enter a password to access the configuration item.

## VERSION 1.0.8

addition CONNECT TRACE PATCH methods ICon parse