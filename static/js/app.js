const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"; 


// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

function init (){
  // Fetch the JSON data and console log it
  let data = d3.json(url).then(function(data) {
    console.log(data);

    let names = data.names;
    let samples = data.samples;
    let metadata = data.metadata;

    init_dropdown (names);

    console.log("Names: "+ names);
    console.log("Samples: " + samples);
    
    //Invoking functions to plot charts in the html- Initialization is done on the first element (id = 940)
    plotBarChart(names[0]);
    plotBubbleChart(names[0]);
    plotMetaData(metadata[0]);
  });
}


// Function that builds the bar chart
function plotBarChart(sample) {

  // Use D3 to retrieve all of the data
  d3.json(url).then((data) => {

      // Retrieve all sample data
      let sampleInfo = data.samples;

      // Filter based on the value of the sample
      let value = sampleInfo.filter(result => result.id == sample);

      // Get the first index from the array
      let valueData = value[0];

      // Get the otu_ids, lables, and sample values
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;

      // Log the data to the console
      console.log(otu_ids, otu_labels, sample_values);

      // Set top ten items to display in descending order
      let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
      let xticks = sample_values.slice(0,10).reverse();
      let labels = otu_labels.slice(0,10).reverse();
      
      // Set up the trace for the bar chart
      let trace = {
          x: xticks,
          y: yticks,
          text: labels,
          type: "bar",
          orientation: "h"
      };

      // Setup the layout
      let layout = {
          title: "Top 10 OTUs Present"
      };

      // Call Plotly to plot the bar chart
      Plotly.newPlot("bar", [trace], layout)
  });

};


// Function that builds the bubble chart
function  plotBubbleChart(sample) {

  // Use D3 to retrieve all of the data
  d3.json(url).then((data) => {
      
      // Retrieve all sample data
      let sampleInfo = data.samples;

      // Filter based on the value of the sample
      let value = sampleInfo.filter(result => result.id == sample);

      // Get the first index from the array
      let valueData = value[0];

      // Get the otu_ids, lables, and sample values
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;

      // Log the data to the console
      console.log(otu_ids,otu_labels,sample_values);
      
      // Set up the trace for bubble chart
      let trace1 = {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth"
          }
      };

      // Set up the layout
      let layout = {
          title: "Bacteria Per Sample",
          hovermode: "closest",
          xaxis: {title: "OTU ID"},
      };

      // Call Plotly to plot the bubble chart
      Plotly.newPlot("bubble", [trace1], layout)
  });
};


function plotMetaData (metadata){

  // Create an array of category labels
  let dataLabels = Object.keys(metadata);        
  // Create an array with Metadata Values
  let dataValues = Object.values(metadata);

  console.log("Labels " + dataLabels);
  console.log("Values " + dataValues);

  // Clear previous contents
  d3.select("#sample-metadata").html("");

  // There are 7 properties in the metadata. Writing The keys and Values in the HTML

  for (let i = 0; i<7; i++){

      console.log(dataLabels[i] + " : " + dataValues[i]);

      d3.select("#sample-metadata").append("h5").text(`${dataLabels[i]}  :  ${dataValues[i]}`);
  };
};

//Function to fill the dropdowns with all the names
function init_dropdown (names){

// Checking current Test Subject ID
let dropdownMenu = d3.select("#selDataset");

//Fill the dropdown with the names and a value that will later match the 
for (let i = 0; i<names.length; i++){

  dropdownMenu.append("option").text(names[i]).property("value", i);
};
};


//Function that is run everytime there is a change in teh TEst Subject ID

// Function that updates dashboard when sample is changed
function optionChanged(value) { 

  // Log the new value
  console.log(value); 

  // Call all functions 
  buildMetadata(value);
  buildBarChart(value);
  buildBubbleChart(value);
};

init();
