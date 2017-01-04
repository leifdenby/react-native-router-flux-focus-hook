# Facilitating re-render, state-update, etc on navigation focus

[react-native-router-flux](https://github.com/aksonov/react-native-router-flux)
doesn't currently make it possible to hook onto the action when a `Scene` is
brought into focus, which makes it impossible update a `Scene` purely based on
navigation. Instead a `Scene` is currently only rendered if the `props`
provided to the scene are changed, which is not always possible or convenient.
This module implements a reducer for the navigation state in which it is
possible to indicate which scene components would like to have a method
(`navigationStateRouter`) called when a `Scene` is brought into focus.

Installation

    npm install --save leifdenby/react-native-router-flux-focus-hook

Where your routes are defined import `NavigationStateHandler` from
`react-native-router-flux-focus-hook` (sorry about the rather awkward name) and
change the navigation state reducer


```diff
+import NavigationStateHandler from 'react-native-router-flux-focus-hook'

class App extends Component {
  render() {
+   const navigationStateHandler = new NavigationStateHandler()

    return (
      <Router 
+      createReducer={navigationStateHandler.getReducer.bind(navigationStateHandler)} 
+      navigationStateHandler={navigationStateHandler}
        >
        <Scene key="root" component={MainComponent}>
        <Scene key="root" component={DynamicComponent}>
        <Scene key="root" component={OtherComponent}>
      </Router>
  }
}
```

This ensures that we can hook on to when navigation actions are fired and
that `navigationStateRouter` is available to every scene component.

Next indicate that a scene component wants to have its
`handleNavigationSceneFocus` method called when the scene is focussed:

```diff
class DynamicComponent extends Component {
  componentDidMount() {
+   this.props.navigationStateHandler.registerFocusHook(this)
  }

  componentWillUnmount() {
+   this.props.navigationStateHandler.unregisterFocusHook(this)
  }

  handleNavigationSceneFocus() {
+   this.setState({ date: "load new data" })
  }
}
```

And finally implement in `handleNavigationSceneFocus` the functionality you need :)

Pull-requests welcome!
