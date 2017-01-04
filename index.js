import { Reducer } from 'react-native-router-flux'

/*
 * This class provides functionality to hook onto `react-native-router-flux`'s
 * FOCUS action, thereby making it possible to update a component's state when
 * it is navigated to. This is currently necessary react-native-router-flux
 * only renders a component the first time it is navigated to, or if the props
 * to a Scene is changed, but neither of these can be achieved with the back
 * button.
 *
 * See README.md for usage example
 */
export default class NavigationStateHandler {
  constructor() {
    this._focusHooks = []
  }

  registerFocusHook(component) {
    const sceneKey = component.props.sceneKey
    // make sure to bind the component to have `this` set to itself so that `setState` etc are available
    if (component.handleNavigationSceneFocus === undefined) {
      throw "Provided component does not define `handleNavigationSceneFocus`"
    }

    const func = component.handleNavigationSceneFocus.bind(component);
    this._focusHooks.push({ sceneKey: sceneKey, func: func})
  }

  unregisterFocusHook(component) {
    const sceneKey = component.props.sceneKey
    this._focusHooks = this._focusHooks.filter((h) => h.sceneKey != sceneKey)
  }

  getReducer(params) {
    const defaultReducer = Reducer(params);

    return (state, action) => {
      if (action.scene && action.type == "REACT_NATIVE_ROUTER_FLUX_FOCUS") {
        this._focusHooks.forEach((hook) => {
          if (hook.sceneKey == action.scene.sceneKey) {
            hook.func()
          }
        })
      }

      return defaultReducer(state, action);
    }
  }
}
