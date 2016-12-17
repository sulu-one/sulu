## Classes

<dl>
<dt><a href="#ApplicationController">ApplicationController</a></dt>
<dd></dd>
<dt><a href="#GUI">GUI</a></dt>
<dd></dd>
<dt><a href="#ApplicationNotifier">ApplicationNotifier</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#fs">fs</a></dt>
<dd></dd>
</dl>

<a name="ApplicationController"></a>

## ApplicationController
**Kind**: global class  

* [ApplicationController](#ApplicationController)
    * [new ApplicationController(config)](#new_ApplicationController_new)
    * [.getFunctionName(fn)](#ApplicationController+getFunctionName) ⇒ <code>String</code>
    * [.registerHotKey(key, fn)](#ApplicationController+registerHotKey)
    * [.requireAll()](#ApplicationController+requireAll)
    * [.loadCSS(path)](#ApplicationController+loadCSS)
    * [.loadHTML(path)](#ApplicationController+loadHTML)
    * [.loadJS(path)](#ApplicationController+loadJS)

<a name="new_ApplicationController_new"></a>

### new ApplicationController(config)

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | ApplicationController configuration |

<a name="ApplicationController+getFunctionName"></a>

### applicationController.getFunctionName(fn) ⇒ <code>String</code>
Determines if a function has a name.

**Kind**: instance method of <code>[ApplicationController](#ApplicationController)</code>  
**Returns**: <code>String</code> - The name of function  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | a JavaScript function |

<a name="ApplicationController+registerHotKey"></a>

### applicationController.registerHotKey(key, fn)
Registers a shortcut (https://github.com/madrobby/keymaster#supported-keys).

**Kind**: instance method of <code>[ApplicationController](#ApplicationController)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | A comma seperated list of short cut keys. |
| fn | <code>function</code> | A named JavaScript function. |

<a name="ApplicationController+requireAll"></a>

### applicationController.requireAll()
Auto scans and loads installed packages.

**Kind**: instance method of <code>[ApplicationController](#ApplicationController)</code>  
<a name="ApplicationController+loadCSS"></a>

### applicationController.loadCSS(path)
Import external CSS code file.

**Kind**: instance method of <code>[ApplicationController](#ApplicationController)</code>  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | Relative or absulote path to file. |

<a name="ApplicationController+loadHTML"></a>

### applicationController.loadHTML(path)
Import external HTML code file.

**Kind**: instance method of <code>[ApplicationController](#ApplicationController)</code>  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | Relative or absulote path to file. |

<a name="ApplicationController+loadJS"></a>

### applicationController.loadJS(path)
Import external JavaScript code file.

**Kind**: instance method of <code>[ApplicationController](#ApplicationController)</code>  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | Relative or absulote path to file. |

<a name="GUI"></a>

## GUI
**Kind**: global class  

* [GUI](#GUI)
    * [new GUI(app)](#new_GUI_new)
    * [.selectActiveRow()](#GUI+selectActiveRow)
    * [.unselectAllRows()](#GUI+unselectAllRows)
    * [.navigateBackToParentFolder()](#GUI+navigateBackToParentFolder)
    * [.enterActiveRow()](#GUI+enterActiveRow)
    * [.makeNextRowActive()](#GUI+makeNextRowActive)
    * [.makePreviousRowActive()](#GUI+makePreviousRowActive)
    * [.toggleActiveFileSystemView()](#GUI+toggleActiveFileSystemView)
    * [.activeView(view)](#GUI+activeView)
    * [.fileSystemViews()](#GUI+fileSystemViews)

<a name="new_GUI_new"></a>

### new GUI(app)

| Param | Type | Description |
| --- | --- | --- |
| app | <code>[ApplicationController](#ApplicationController)</code> | the ApplicationController |

<a name="GUI+selectActiveRow"></a>

### guI.selectActiveRow()
Mark active row of active file system view as selected.

**Kind**: instance method of <code>[GUI](#GUI)</code>  
<a name="GUI+unselectAllRows"></a>

### guI.unselectAllRows()
Mark all rows of active file system view as not selected.

**Kind**: instance method of <code>[GUI](#GUI)</code>  
<a name="GUI+navigateBackToParentFolder"></a>

### guI.navigateBackToParentFolder()
Navigates to parent folder in active file system view.

**Kind**: instance method of <code>[GUI](#GUI)</code>  
<a name="GUI+enterActiveRow"></a>

### guI.enterActiveRow()
Navigates to active row in active file system view.

**Kind**: instance method of <code>[GUI](#GUI)</code>  
<a name="GUI+makeNextRowActive"></a>

### guI.makeNextRowActive()
Sets active row status to next row in active file system view.

**Kind**: instance method of <code>[GUI](#GUI)</code>  
<a name="GUI+makePreviousRowActive"></a>

### guI.makePreviousRowActive()
Sets active row status to previous row in active file system view.

**Kind**: instance method of <code>[GUI](#GUI)</code>  
<a name="GUI+toggleActiveFileSystemView"></a>

### guI.toggleActiveFileSystemView()
Toggles active file system view.

**Kind**: instance method of <code>[GUI](#GUI)</code>  
<a name="GUI+activeView"></a>

### guI.activeView(view)
Gets or sets the active file system view.

**Kind**: instance method of <code>[GUI](#GUI)</code>  

| Param | Type | Description |
| --- | --- | --- |
| view | <code>View</code> | the file-system-view |

<a name="GUI+fileSystemViews"></a>

### guI.fileSystemViews()
Return the DOM and datamodel of all file system views.

**Kind**: instance method of <code>[GUI](#GUI)</code>  
<a name="ApplicationNotifier"></a>

## ApplicationNotifier
**Kind**: global class  

* [ApplicationNotifier](#ApplicationNotifier)
    * [new ApplicationNotifier(app)](#new_ApplicationNotifier_new)
    * _instance_
        * [.msg(msg)](#ApplicationNotifier+msg)
        * [.dlg(settings, done)](#ApplicationNotifier+dlg)
    * _static_
        * [.app](#ApplicationNotifier.app)
            * [new app(config)](#new_ApplicationNotifier.app_new)

<a name="new_ApplicationNotifier_new"></a>

### new ApplicationNotifier(app)

| Param | Type | Description |
| --- | --- | --- |
| app | <code>[ApplicationController](#ApplicationController)</code> | the ApplicationController |

<a name="ApplicationNotifier+msg"></a>

### applicationNotifier.msg(msg)
Show a toaster with a given message string.

**Kind**: instance method of <code>[ApplicationNotifier](#ApplicationNotifier)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | the toaster message |

<a name="ApplicationNotifier+dlg"></a>

### applicationNotifier.dlg(settings, done)
Show a dialog with the given settings.

**Kind**: instance method of <code>[ApplicationNotifier](#ApplicationNotifier)</code>  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>String</code> | the dialog settings |
| done | <code>function</code> | the dialog close callback |

<a name="ApplicationNotifier.app"></a>

### ApplicationNotifier.app
**Kind**: static class of <code>[ApplicationNotifier](#ApplicationNotifier)</code>  
<a name="new_ApplicationNotifier.app_new"></a>

#### new app(config)

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | ApplicationController configuration |

<a name="fs"></a>

## fs
**Kind**: global variable  
**Author:** Stephan Ahlf  
**License**: MIT  
**Copyright**: (c) 2016 Stephan Ahlf  
