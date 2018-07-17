//         <head>
// <!-- Plotly.js -->
//         <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
//         </head>
//         <body>
//         <!-- Plotly chart will be drawn inside this DIV -->
//         <div id="myDiv" style="width:100%;height:100%"></div>
//         <script>
//         /* JAVASCRIPT CODE GOES HERE */

// Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/_3d-line-plot.csv', function(err, rows){
//       function unpack(rows, key) {
//           return rows.map(function(row) 
//           { return row[key]; });
//       }

// var datas =[];

// function randomRange(min,max){
//   return Math.floor(Math.random() * ((max-min)+1) + min);
// }

// for(var i=0;i<20;i++){
//   var x = [];
//   var y =[];
//   var z=[];
//   for(var j=0;j<100;j++){
//     x.push(i);
//     y.push(j);
//     if(j>20 && j<30){
//       z.push(randomRange(10,20)/10);
//     }else{
//       z.push(randomRange(1,3)/10);
//     }
   
//   }

//   var data = {
//   x:x,
//   y:y ,
//   z: z,
//   mode: 'lines',
//   marker: {
//     color: '#1f77b4',
//     size: 12,
//     symbol: 'circle',
//     line: {
//       color: 'rgb(0,0,0)',
//       width: 0
//     }
//   },
//   line: {
//     color: '#1f77b4',
//     width: 1
//   },
//   type: 'scatter3d'
// };
// datas.push(data);
// }

// var trace1 = {
//   x:[1,1,1,1,1,1,1,1,1,1],
//   y:[1,2,3,4,5,6,7,8,9,10] ,
//   z: [2,4,6,5,2,7,8,9,6,2],
//   mode: 'lines',
//   marker: {
//     color: '#1f77b4',
//     size: 12,
//     symbol: 'circle',
//     line: {
//       color: 'rgb(0,0,0)',
//       width: 0
//     }
//   },
//   line: {
//     color: '#1f77b4',
//     width: 1
//   },
//   type: 'scatter3d'
// };

// // var trace2 = {
// //   x: unpack(rows, 'x2'),
// //   y: unpack(rows, 'y2'),
// //   z: unpack(rows, 'z2'),
// //   mode: 'lines',
// //   marker: {
// //     color: '#9467bd',
// //     size: 12,
// //     symbol: 'circle',
// //     line: {
// //       color: 'rgb(0,0,0)',
// //       width: 0
// //     }
// //   },
// //   line: {
// //     color: 'rgb(44, 160, 44)',
// //     width: 1
// //   },
// //   type: 'scatter3d'
// // };
// // var trace3 = {
// //   x: unpack(rows, 'x3'),
// //   y: unpack(rows, 'y3'),
// //   z: unpack(rows, 'z3'),
// //   mode: 'lines',
// //   marker: {
// //     color: '#bcbd22',
// //     size: 12,
// //     symbol: 'circle',
// //     line: {
// //       color: 'rgb(0,0,0)',
// //       width: 0
// //     }
// //   },
// //   line: {
// //     color: '#bcbd22',
// //     width: 1
// //   },
// //   type: 'scatter3d'
// // };
// var data = datas;//, trace2, trace3];
// var layout = {
//   title: '3D Line Plot',
//   autosize: false,
//   showlegend:false,
//   width: 1000,
//   height: 500,
//   margin: {
//     l: 0,
//     r: 0,
//     b: 0,
//     t: 65
//   },
//   scene:{
//     aspectratio:{
//       x:1,y:2,z:0.1
//     },
//     camera:{
//       eye:{x: 1.9896227268277047, y: 0.0645906841396725, z: 0.5323776223386583}
//     }
//   }
// };

// Plotly.newPlot('myDiv', data, layout,{displayModeBar: false}).then(
//     function(gd)
//      {
//         window.plot = gd;
//     });; 
// });
// //window.plot.layout
//         </script>
//         </body>

        


