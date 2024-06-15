#include <Wire.h>  
String long_lat;

String Link;
String SMS;

#include <TinyGPS++.h>

#include <SPI.h>        //SPI library for communicate with the nRF24L01+ 
#include "Wire.h"       //For communicate
#include "I2Cdev.h"     //For communicate with MPU6050
#include "MPU6050.h"    //The main library of the MPU6050
TinyGPSPlus gps;

static const uint32_t GPSBaud = 9600;

float latitude;
float longitude;
 int push=12;

 int buzzer=5;
 int vibsensor=21;

 
int m2=22;
int m1=2;

MPU6050 mpu;
int16_t ax, ay, az;
int16_t gx, gy, gz;
int data[2];

void get_location(String message)
{ 
  Serial2.print("ATD +918073744810;\r");
  delay(1000);

  Serial2.print("AT+CMGF=1\r");     // AT command to set SIM900 to SMS mode
  delay(100);
  Serial2.print("AT+CNMI=2,2,0,0,0\r");       // Set module to send SMS data to serial out upon receipt
  delay(100);
    
  Serial2.println("AT+CMGF=1"); // Replace x with mobile number
  delay(1000);
  Serial2.println("AT+CMGS= \"+918073744810\"\r"); // Replace * with mobile number  sim number - 8861273413
  delay(1000); 
  Serial2.println(message);// The SMS text you want to send
  delay(100);
  Serial2.println((char)26);// ASCII code of CTRL+Z
} 

void GPS()
{
if (gps.charsProcessed() < 10)
  {
    //Serial.println("No GPS detected: check wiring.");
     // Blynk.virtualWrite(V4, "GPS ERROR");         // Value Display widget  on V4 if GPS not detected
  }
}
void displaygpsInfo()
{ 

  if (gps.location.isValid() ) 
  {
    
     latitude = (gps.location.lat());      //Storing the Lat. and Lon. 
     longitude = (gps.location.lng()); 
    
    Serial.print("LAT:  ");
    Serial.println(latitude, 6);                // float to x decimal places
    Serial.print("LONG: ");
    Serial.println(longitude, 6); 
     
      }
}
 

void locate()
{
  while (Serial.available() > 0) 
    {
      // sketch displays information every time a new sentence is correctly encoded.
      if (gps.encode(Serial.read()))
        displaygpsInfo();
  }
}

void panic()
{
int switch11=digitalRead(push); 
mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
 
  data[0] = map(ax, -17000, 17000, 300, 400 ); //Send X axis data
  data[1] = map(ay, -17000, 17000, 100, 200);  //Send Y axis data
//  Serial.write(data, sizeof(data));
  
  Serial.println(data[0]);
  Serial.println(data[1]);
 delay(1000);
 
if(switch11==0)
{
   long_lat = String(float(latitude))+","+String(float(longitude));
   Link = "https://www.google.com/maps/search/?api=1&query="+String(long_lat);
   SMS = "Alert: panic detected "+ long_lat + " " + Link;//////////////////////////////SMS message
   Serial.println(long_lat);
   Serial.println("panic message sent");
   get_location(SMS); 
   digitalWrite(buzzer,HIGH); 
 
}

else if(data[0] > 380 || data[0] < 310  || data[1] < 110 || data[1] > 180) { 
    Serial.println("Accident detected");
   
   long_lat = String(float(latitude))+","+String(float(longitude));
   Link = "https://www.google.com/maps/search/?api=1&query="+String(long_lat);
   SMS = "Emergency, i am panic,  "+ long_lat + " " + Link; //////////////////////////////SMS message
   Serial.println("message sent");
   get_location(SMS);  
   digitalWrite(buzzer,HIGH);
 }



 
  else if(data[0]>320 && data[0]<370 || data[1]>120 && data[1]<170 || switch11==1 )
  { 
    Serial.println("NO ACCIDENT");
     digitalWrite(buzzer,LOW); 
   
  } 
else
{      
  digitalWrite(buzzer,LOW); 
  
  }
  }

 
void setup() {
  // put your setup code here, to run once:
  
  Serial.begin(9600); 
  Serial2.begin(9600);
 Serial.begin(GPSBaud);
   Wire.begin();
  mpu.initialize();
  pinMode(buzzer,OUTPUT);
  pinMode(push,INPUT_PULLUP);  
}

void loop() {
  // put your main code here, to run repeatedly:
locate();
panic();
 
}
