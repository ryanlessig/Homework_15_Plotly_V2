function buildMetadata(sample) {
  url_build_meta_Data = `/metadata/${sample}`;

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var dataPanel = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    dataPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

  d3.json(url_build_meta_Data).then(function (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
        dataPanel.append("h6").text(`${key}: ${value}`
        );
      })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

});
}

function buildCharts(sample) {
  url_build_charts = `/samples/${sample}`;

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url_build_charts).then(function (chartData){

    var chartData = [chartData];
    otuID = chartData[0].otu_ids;
    otuLabel = chartData[0].otu_labels;
    sampleValue = chartData[0].sample_values;

    // @TODO: Build a Bubble Chart using the sample data
    var bubbleTrace = {
      x: otuID,
      y: sampleValue,
      text: otuLabel,
      mode: 'markers',
      marker: {
        size: sampleValue,
        color: otuID
      }
    };

    var bubbleData = [bubbleTrace];
    var bubbleLayout = {
      hieght: 500,
      width: 1200,
      showlegend: true
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var pieTrace = {
      labels: otuID.slice(0, 10),
      values: sampleValue.slice(0, 10),
      text: otuLabel.slice(0, 10),
      type: 'pie'
    };

    var pieData = [pieTrace];
    var pieLayout = {
      hieght: 500,
      width: 500,
      showlegend: true
    };
    
    Plotly.newPlot("pie", pieData, pieLayout);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();