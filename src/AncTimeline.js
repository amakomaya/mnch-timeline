import React, { useEffect } from "react";
import axios from "axios";
import anychart from "anychart";
import "anychart/dist/css/anychart-ui.min.css";
import "anychart/dist/fonts/css/anychart-font.min.css";
import { config } from "./config";
import { adToBs } from "@sbmdkl/nepali-date-converter";
import moment from 'moment';


const ANCTimeline = ({ teiId, programId, orgUnitId, enrollmentId }) => {
  useEffect(() => {
    const fetchDataAndDrawChart = async () => {
      const baseUrl = config.baseUrl;
      // const username = "kripa.shrestha";
      // const password = "P@ssword123";
    
      try {
        // const enrollmentUrl = `${baseUrl}/api/enrollments?enrollment=FmxopZoeQjs`;
        const enrollmentUrl = `${baseUrl}/api/enrollments?enrollment=${enrollmentId}`; 

        const enrollmentResponse = await axios.get(enrollmentUrl, {
          headers: { "Content-Type": "application/json" },
          // auth: { username, password },
        });
    
        const lmpDateEN = enrollmentResponse.data?.enrollments[0]?.incidentDate;
        const convertDateToBS = (dateString) => {
          if (typeof dateString === "string") {
            const dateOnlyString = dateString.split("T")[0];
            return adToBs(dateOnlyString);
          }
          return dateString;
        };
    
        const preconceptionStartDate = moment(lmpDateEN).subtract(14, "days").format("YYYY-MM-DD");
        const ancEndDate = moment(lmpDateEN).add(280, "days").format("YYYY-MM-DD"); 
        // const eventsUrl = `${baseUrl}/api/tracker/events?fields=event,status,program,dataValues,occurredAt,programStage,enrollment&program=K59HMyJxUXf&orgUnit=nCepixkziK3&trackedEntity=Dnvc7lyFR40`;
        const eventsUrl = `${baseUrl}/api/tracker/events?fields=event,status,program,dataValues,occurredAt,programStage&program=${programId}&orgUnit=${orgUnitId}&trackedEntity=${teiId}`;

        const response = await axios.get(eventsUrl, {
          headers: { "Content-Type": "application/json" },
          // auth: { username, password },
        });
    
        let ancColor; 
        let deliveryColor;
        let pncColor;
        let deliveryDate ;
        let pncEndDate;
        
        const momentData = []; 
        momentData.push([
          convertDateToBS(lmpDateEN),
          `<b>LMP Date:</b> ${convertDateToBS(lmpDateEN)}`,
        ]);
        if (response.data && Array.isArray(response.data.events)) {
          const fetchedEvents = response.data.events;
          const dataElementIds = [];
          const programStageIds = [];
    
          fetchedEvents.forEach((event) => {
            event.dataValues.forEach((dataValue) => {
              programStageIds.push(event.programStage);
              if (!dataElementIds.includes(dataValue.dataElement)) {
                dataElementIds.push(dataValue.dataElement);
              }
            });
          });
    
          const programUrl = `${baseUrl}/api/programs.json?filter=id:eq:K59HMyJxUXf&fields=id,name,style,programStages[id,style]&paging=false`;
          const stylesMap = {};
    
          try {
            const programDataResponse = await axios.get(programUrl, {
              headers: { "Content-Type": "application/json" },
              // auth: { username, password },
            });
    
            if (programDataResponse.data?.programs?.length > 0) {
              const programData = programDataResponse.data.programs[0].programStages;
              programData.forEach(({ id, style }) => {
                stylesMap[id] = {
                  color: style.color || "#000",
                  icon: style.icon || "default_icon",
                };
              });
            }
          } catch (error) {
            console.error("Error fetching program styles:", error);
          }
    
          const programstageMap = {};
          const programStageUrl = `${baseUrl}/api/programStages.json?filter=id:in:[${programStageIds.join(",")}]`;
    
          try {
            const programStageResponse = await axios.get(programStageUrl, {
              headers: { "Content-Type": "application/json" },
              // auth: { username, password },
            });
    
            if (programStageResponse.data && Array.isArray(programStageResponse.data.programStages)) {
              programStageResponse.data.programStages.forEach((element) => {
                programstageMap[element.id] = element.displayName;
              });
            }
          } catch (error) {
            console.error("Error fetching program stages:", error);
          }
    
          const dataElementMap = {};
          const dataElementsUrl = `${baseUrl}/api/dataElements.json?filter=id:in:[${dataElementIds.join(",")}]&fields=id,name,formName`;
    
          try {
            const dataElementsResponse = await axios.get(dataElementsUrl, {
              headers: { "Content-Type": "application/json" },
              // auth: { username, password },
            });
    
            if (dataElementsResponse.data && Array.isArray(dataElementsResponse.data.dataElements)) {
              dataElementsResponse.data.dataElements.forEach((element) => {
                dataElementMap[element.id] = element.formName;
              });
            }
          } catch (error) {
            console.error("Error fetching data elements:", error);
          }
    
          const formattedData = fetchedEvents.map((event) => {
            const programStageName = programstageMap[event.programStage];
            const programStageId = event.programStage;
            const style = stylesMap[event.programStage] || { color: "#000" };
            const color = style.color;
    
            const eventData = event.dataValues
            .map((dataValue) => {
              const label = dataElementMap[dataValue.dataElement] || dataValue.dataElement;
              let value = dataValue.value;
              if (value === "true") {
                value = "Yes";
              } else if (value === "1" || value === "2"|| value === "3"|| value === "4" || value === "5"|| value === "6") {
                return null; 
              }
          
              return { label, value };
            })
            .filter((data) => data !== null); 
          
    
            if (programStageId === "vsmAhG18JSl") {
              ancColor = color;
            }  
            
            if (programStageId === "Gdf45yp6r0Q") {
              deliveryColor = color;
              deliveryDate = event.occurredAt;
              pncEndDate = moment(deliveryDate).add(42, "days").format("YYYY-MM-DD"); 

            }
            
            
            if (programStageId === "RQeCTBrhh3Q") {
              pncColor = color;
            }
    
            // Populate momentData
            momentData.push([
              convertDateToBS(event.occurredAt),
              `${programStageName}<br/> ${eventData.map((data) => `${data.label}:${data.value}`).join("<br/>")}`,
              
            ]);
            
          
    
            return {
              occurredAt: event.occurredAt,
              programStage: programStageName,
              programStageId: programStageId,
              color: color,
              data: eventData,
            };
          });
    
        }
    
        const rangeData = [
          {
            name: "गर्भधारण पूर्व",
            start: convertDateToBS(preconceptionStartDate),
            end: convertDateToBS(lmpDateEN),
            fill: "#00a8e0 0.5",
            stroke: "#00a8e0",
          },
          {
            name: "गर्भावस्था",
            start: convertDateToBS(lmpDateEN),
            end: convertDateToBS(ancEndDate),
            fill: ancColor,
            stroke: ancColor,
          },
          {
            name: "प्रशुती सम्बन्धी विवरण",
            start: convertDateToBS(deliveryDate),
            end: convertDateToBS(deliveryDate),
            fill: deliveryColor,
            stroke: deliveryColor,
          },
          
          {
            name: "सुत्केरी अवस्था",
            start: convertDateToBS(deliveryDate),
            end: convertDateToBS(pncEndDate),
            fill: pncColor,
            stroke: pncColor,
          },
        ];
    
        // Draw the chart
        anychart.onDocumentReady(() => {
          const chart = anychart.timeline();
          const rangeSeries = chart.range(rangeData);
          const momentSeries = chart.moment(momentData);
    
          rangeSeries
            .labels()
            .useHtml(true)
            .fontColor("#000")
            .format(
              '{%name}<br><span style="font-size: 85%">{%start}{dateTimeFormat:YYYY-MM-DD}–{%end}{dateTimeFormat:YYYY-MM-DD}</span>'
            );
    
            momentSeries
            .labels()
            .useHtml(true)
            .fontColor("#000") 
          

          momentSeries.normal().markers().fill("#ffdd0e");
          momentSeries.normal().markers().stroke("#e9ae0b");
    
          chart.scroller().enabled(true);
          chart.container("anc-timeline-container");
          chart.draw();
        });
      } catch (error) {
        console.error("Error fetching data or drawing chart:", error);
      }
    };
    

    fetchDataAndDrawChart();
  }, [teiId, programId, orgUnitId, enrollmentId]);

  return <div id="anc-timeline-container" style={{ width: "100%", height: "300px" }} />;
};

export default ANCTimeline;
