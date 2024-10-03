# features/ directory

- Contains reusable Feature Components. A Feature Component is a concept inspired by Redux in which all logic required for a feature is co-located to a single directory. A Feature Component is often composed of many other components, either local or shared. The same is true for all resources: utils, hooks, and so on.
- Feature Components often include side-effects.
- If using Redux, and interacting with the Store, the Feature Component will include a slice file that defines the “slice” of the Redux Store the feature represents.
- This corresponds to the domain layer in DDD.
