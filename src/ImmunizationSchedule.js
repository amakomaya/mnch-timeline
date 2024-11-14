// ImmunizationSchedule.js
import React,{ useEffect, useState }  from "react";
import classes from "./Plugin.module.css";
import axios from 'axios';
import { adToBs } from "@sbmdkl/nepali-date-converter";
import { config } from './config';



const ImmunizationSchedule = ({ teiId, programId, orgUnitId}) => {
    const [immunizationData, setImmunizationData] = useState([]);
    const baseUrl = config.baseUrl;            
    // const eventsUrl = `https://www.health.dhis2mis.org/api/tracker/events?fields=event,status,program,dataValues,occurredAt,programStage,enrollment&program=VIaUhEORZf2&orgUnit=nCepixkziK3&trackedEntity=S9qpl7jh20U`;
    const eventsUrl = `${baseUrl}/api/tracker/events?fields=event,status,program,dataValues,occurredAt,programStage,enrollment&program=${programId}&orgUnit=${orgUnitId}&trackedEntity=${teiId}`;
    // const username = "kripa.shrestha"; 
    // const password = "P@ssword123"; 
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(eventsUrl, {
            headers: { "Content-Type": "application/json" },
            // auth: { username, password },
    });
          if (response.data && Array.isArray(response.data.events)) {
            const fetchedEvents = response.data.events;
            setImmunizationData(fetchedEvents);

          } else {
            console.error("Unexpected data format:", response.data);
          }
        } catch (error) {
          console.error("Error fetching events data:", error);
        }
      };
  
      fetchData();
    }, []);


    const getEventDateForStage = (programStage, dataElement) => {
      const matchedEvents = immunizationData
        .filter(event => event.programStage === programStage)
        .sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
    
      let occurredDates = [];
    
      for (const event of matchedEvents) {
        const trueDataValue = event.dataValues && event.dataValues.find(dv => dv.dataElement === dataElement && dv.value === "true");
        if (trueDataValue && event.occurredAt) {
          const occurredAt = adToBs(event.occurredAt.split('T')[0]);
          occurredDates.push(occurredAt);
          break; //latest first date taken if duplicate
        }
      }
    
      return occurredDates;
    };
    
  
  return (
    <div className={classes.scheduleContainer}>
    <h1 style={{ textAlign: 'center' ,fontSize:"18px", fontWeight:"bold"}}>खोप लगाएको विवरण</h1>
      <table className={classes.scheduleTable}>
        <thead>
          <tr>
            <th>खोपको नाम</th> 
            <th>जन्मेने वित्तिकै</th>
            <th>६ हप्ता</th>
            <th>१० हप्ता</th>
            <th>१४ हप्ता</th>
            <th>९ महिना</th>
            <th>१२ महिना</th>
            <th>१५ महिना</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={classes.vaccineName}>बि.सि.जी</td>
            <td>{getEventDateForStage("TJbSbqY9pKA","vu1O2q5Q8NZ")}</td> 
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>         
          </tr>
          <tr>
            <td className={classes.vaccineName}>डि.पि.टि <br />हेप.वि.हिव</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td>{getEventDateForStage("XQ84jQrYpKb","DrKIhesvRzh")}</td>
            <td>{getEventDateForStage("buwbIDyhPHk","JLWtznxHZI9")}</td>
            <td>{getEventDateForStage("CxEBMJlIyjl","rFSHAVkU2OR")}</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
           
          </tr>
          <tr>
            <td className={classes.vaccineName}>ओ.पि.भी</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>            
            <td>{getEventDateForStage("XQ84jQrYpKb","BY40xEzBI5e")}</td>
            <td>{getEventDateForStage("buwbIDyhPHk","FacrkG4UGsl")}</td>
            <td>{getEventDateForStage("CxEBMJlIyjl","X1R0t6Yjv9N")}</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
           
          </tr>

          <tr>
            <td className={classes.vaccineName}>पि.सि.भी.</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>            
            <td>{getEventDateForStage("XQ84jQrYpKb","O0C3glzpo07")}</td>
            <td>{getEventDateForStage("buwbIDyhPHk","DAfaUFDoGKf")}</td>
            <td className={classes.disabledCell}></td>
            <td>{getEventDateForStage("FCTAzMRlw12","WfRjP9GzuDZ")}</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
           
          </tr>

          <tr>
            <td className={classes.vaccineName}>रोटा</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>            
            <td>{getEventDateForStage("XQ84jQrYpKb","VeNVEO0iLlX")}</td>
            <td>{getEventDateForStage("buwbIDyhPHk","oYnd19k0QG8")}</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
           
          </tr>

          <tr>
            <td className={classes.vaccineName}>एफ/आई.पि.भी.</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>            
            <td className={classes.disabledCell} aria-disabled="true"></td>            
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td>{getEventDateForStage("CxEBMJlIyjl","IajgpKk31jI")}</td>
            <td>{getEventDateForStage("FCTAzMRlw12","sgDLXFt64Kg")}</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
        </tr>

          <tr>
            <td className={classes.vaccineName}>दादुरा रुवेला</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>            
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td>{getEventDateForStage("FCTAzMRlw12","WfRjP9GzuDZ")}</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td>{getEventDateForStage("O4fE2bBb16p","TBmLjRBVunN")}</td>
           
          </tr>
          <tr>
            <td className={classes.vaccineName}>जे.ई</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>            
            <td className={classes.disabledCell} aria-disabled="true"></td>            
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
            <td>{getEventDateForStage("Jg7x3jFRGve","F2jDyYuZkAA")}</td>
            <td className={classes.disabledCell} aria-disabled="true"></td>
           
          </tr>
       

          
        </tbody>
        
      </table>
    </div>
  );
};

export default ImmunizationSchedule;
