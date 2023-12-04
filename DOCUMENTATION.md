# FRONT-END DOCUMENTATION

## Overview

This document serves as the user guide for the INTUITION app. Both deployment and regular usage are covered here.

## Deploying the Application

### Prerequisites

- React environment setup
- npm (Node Package Manager)
- Access to the INTUITION backend service

### Steps

1. Clone the repository to your local machine.
2. Navigate to the application directory.
3. Run `npm install` to install all dependencies.
4. Ensure the backend service is running. By default, it will run on `http://localhost:8080`.
5. Start the frontend application using `npm start`.
6. The application will be accessible at `http://localhost:3000`.
7. To configure the port where the app runs, change the `.env` file found in the project root.
8. If a different backend location was chosen, change the backendUrl parameter in `public/config.js`.

*Note: Deployment steps may vary based on the hosting service or environment.*

## User Guide

### Using the app

Currently, the app does not support user input for selecting the SPARQL endpoint. To use a custom SPARQL endpoint, modify the endpointUrl parameter in the public/config.js file. After connecting, the app will display a loading animation while it parses the data. The duration of this process depends on the complexity and volume of data at the chosen endpoint, as well as its response time.

### Sections of the app

The interface can be divided in three areas: the graph, the lists and the control panel.

### The graph

The main interactive area is the white screen located in the middle of the app. Here, using the rest of the elements you'll be able to define the graph that represents the query you want to make to the server. Elements here can be moved around and clicked freely. Selected elements will show bolded.

### The lists

On the left side of the application, you will find two lists composed of "nodes". These nodes consist of the topmost classes defined in the endpoint. These are either classes that inherit directly from 'thing' or have no parent class. Both lists are used to specify the elements you wish to fetch from the endpoint:

1. **Specific Node List**: Fetch and search for specific nodes, already existing in the RDF.
2. **Variable Node List**: Represents all elements from a class.
Clicking any of these nodes will display them on the current graph.

### The control panel

The control panel is located underneath the graph. Here are located the buttons that help you interact with the nodes added to the graph. A preview of the results wil also be shown here.

### Defining queries

- **Adding Nodes**: Click a node in the list to add it to the screen.
- **Defining Properties**: Click a node on screen to define properties between nodes using the control panel. An arrow will visualize the connection. Both the instances and the subclass properties, separated by a gray divider, will show. Hovering on any property will show the targets available, and a text input to create SPARQL 'VALUES' clauses. These clauses are generic and have no parent class.
- **Modifying Data Properties**: Double-click a node or use the 'Data Properties' button on the control panel's left side to modify its data and annotation properties.
- **Creating Bindings**: Click on the 'Shown nodes' button and click the last option, named 'Bindings...'. A modal will open allowing you to define variables using the existing values through the graph (including other bindings) and operators. Bindings are graph-related. To once done working with them, click 'Set bindings' to define them.
- **Defining filters**: Click on the filter button. A modal will show allowing to set filters using the values set in the graph that define the results shown in the query. The app is set so this types of interactions are allowed only for combinations that make sense (using lesser than in numeric values but not boolean etc).
- **Selecting output**: Click on the 'No nodes shown' binding to open the dropdown that defines what the elements in the graph. You can add or subtract elements by clicking + or -. Data properties and bindings set to be shown will be taken into account too.
- **Defining unions**: Click on the rightmost tab to show the graphs that have been defined in the app. By default only one will be shown. You can Create new graphs and include them inside others, the app limiting you if a loop would be created. They show as a special node, whose only property is the special 'UNION' one. When clicking 'query', the current one will be the one parsed to construct it, it including the unions of the graphs it contains. Currently, the nodes referenced in each graph with the same number refer to the same variable, same happens for the bindings.

### Importing and Exporting Queries

- **Importing**: Use the 'Export queries' button to load a query from a file.
- **Exporting**: Use the 'Load queries' button to save your current query configuration into a file.

### Checking Results

- After configuring your query, use the 'Query' button to run it.
- The results will be shown in the middle of the control panel, inside a table with resizable columns.
- Specific values can be quickly searched for using the search bar on top.
- In the bottom right corner, the number of results displayed will dynamically change to reflect the total count of elements that meet the criteria set by the search filter.
- A special view can be accessed by clicking the button located at the end of the search bar. In this view, a tray for refined searching will be available at the top right corner, enabling more precise search capabilities.

## Additional Features

- **Home page**: Includes a brief explanation of the app.
- **About page**: Includes the creators of the tool.

For further assistance or bug reporting, feel free to create an issue or contact us directly.
