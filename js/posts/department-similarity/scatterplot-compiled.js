'use strict';d3.csv('/datasets/department-similarity/tsne.csv',function(a,b){b=processData(b),plot(b,'#scatterplot'),$(window).resize(function(){return plot(b,'#scatterplot')})});function plot(a,b){$(b).html('');var e=$(b).outerWidth(),f=400>e,h=e*0.85,k=h*1,l=d3.select(b).append('svg').attr('width',h).attr('height',k).attr('id','scatterplot-svg'),m=f?20:30,n=d3.scaleLinear().domain(d3.extent(a,function(y){return y.x1})).range([m,h-m]),o=d3.scaleLinear().domain(d3.extent(a,function(y){return y.x2})).range([k-m,m]);a.forEach(function(y){y.x_=n(y.x1),y.y_=o(y.x2)});var q=f?['Mathematics','Geography','Statistics','Environment','Sociology','Communication Studies','Bioengineering']:['Mathematics','Computer Science','Life Sciences','Psychology','Bioengineering','Economics','Management','Physics','Theater','Sociology','Communication Studies','History','Classics','Italian','English','Korean','Chinese','Dance','Geography','Environment','Nursing','Education'],t={Psychology:-15},u={Italian:10,Management:-15,Psychology:10,Chinese:10,Economics:10,Geography:-5,Environment:10,'Life Sciences':15},v=l.selectAll('text').data(a.filter(function(y){return q.includes(y.subject)})).enter().append('text').attr('x',function(y){return y.x_+0+(t[y.subject]?t[y.subject]:0)}).attr('y',function(y){return y.y_+0+(u[y.subject]?u[y.subject]:0)}).text(function(y){return y.subject}).style('font-size',f?11:13),w=d3.tip().attr('class','scatterplot-tip').html(function(y){return'<span>'+y.subject+'</span>'});l.call(w);l.selectAll('circle').data(a).enter().append('circle').attr('cx',function(y){return y.x_}).attr('cy',function(y){return y.y_}).attr('r',f?5:7).attr('class','subject-circle default-circle').on('mouseover',function(y,z){w.show(y),d3.selectAll('circle').attr('class',function(A,B){return B==z?'subject-circle default-circle circle-stroke':'subject-circle grey-circle'}),v.style('opacity',0)}).on('mouseout',function(y){w.hide(y),d3.selectAll('circle').attr('class','subject-circle default-circle'),v.style('opacity',1)});v.raise()}function processData(a){return a.forEach(function(b){b.x1=+b.x1,b.x2=+b.x2}),a}