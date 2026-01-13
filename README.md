# **Disease Outbreak Dashboard**

----

## **Project Overview**

I am visiting the **Disease Outbreak Dashboard**. The **Disease Outbreak Dashboard** is a web portal. It is based on providing ** warnings**. The **Disease Outbreak Dashboard** is also about **monitoring the outbreak of diseases in India**.

The **Disease Outbreak Dashboard** grabs **real-time data** from places. Then it feeds this **real-time data** through **machine-learning**. The **machine-learning** is used to predict what will happen.

The **Disease Outbreak Dashboard** also allows **members of the community** to post what they observe about **the outbreak of diseases in India**. This way the **Disease Outbreak Dashboard** is very useful, for **monitoring the outbreak of diseases in India**. Providing **prior warnings**. So that **users, authorities and health planners** can make choices because they have seen the **data**. This way **users, authorities and health planners** are able to make smart **decisions** that are based on the **data** they have.

----

## **Platform Focus**

- **Prevention (early alerts)**

![alt text](<Screenshot 2026-01-01 201053.png>)

- **Intervention (analytics and visual risk measures)**

![alt text](<Screenshot 2026-01-01 201110.png>)

- **Preparedness in response (insight and notification of health care)**

![alt text](<Screenshot 2026-01-01 201121.png>)

----

## **Quick Start (Development Setup)**

**Quick Start (Development Setup)**. This is the page that helps you **run the project * on your own computer so you can see how everything works. It is really important to **run the project * before you start making any changes.

----

## **Environment Variables (.env.local)**

You need to create a file called **.env.local**. Then you have to put your **keys** in this **.env.local** file.

----

### **Required keys**

- **WEATHERAPIKEY**. Gets us the weather and things like how humid it is how much rain is falling and the temperature. Then it uses this **weather and environmental information** to help figure out the risk of getting sick. It is really useful, for understanding **real time weather and environmental information**. How it affects **disease-risk estimations**.

- **OPENROUTERAPIKEY** is what makes the *outbreak ML prediction in the server** work. This thing can predict what will happen up, to **714 days ahead**. The **OPENROUTERAPIKEY** stays on the *server as a backup**. This is good because *raw calls** are never sent to the front end. This way the app's **secure** and it is also **scalable** because of the **OPENROUTERAPIKEY** and the way it is divided.

----

## **Install & Run**

pnpm install

pnpm dev

When you have finished running **pnpm** all the dependencies are downloaded.

The **pnpm dev** has started now.

This **pnpm** application is on your **** machine.

You can test the **pnpm** application. Do development work, on it.

----

## **API Endpoints**

The things that will make the dashboard work are the **API endpoints**. These **API endpoints** are really important, for the dashboard. The **API endpoints** that will power the dashboard are:

- **GET /api/disease-data**. Gets you the information about disease risks. This includes what is going on with disease risks, in each state maps to show where the risks are and analytics to help understand the disease data. The disease data is really important and the **disease-risk information** you get from this is the current. You will also get **state-level risk** for the disease **maps** of the areas and **disease analytics** to look at.

- **GET /api/predictions** - rants more **rapid image reverse engineering of pre-computed outbreak prediction results** in the **cache**.

- **POST /api/predictions**. Starts the *ML-based prediction trigger** with the **OPENROUTERAPIKEY**. This **OPENROUTERAPIKEY** can be either new or something we already figured out. The good thing is that the *ML-based prediction trigger** costs are really low when we use the **OPENROUTERAPIKEY**.

----

## **Defining Characteristics**

----

### **Live Risk Map**

This thing has a map that shows you where diseases are likely to spread in each state. The map is really cool because it uses **heatmap and colors** to show the risk. If you **hover or click** on it you can see details about the **risk of outbreaks, per state**.

- **Risk intensity**

- **Affected regions**

- **Environmental factors**

Get this **real-time information on dangerous areas**.

----

### **Analytics Insights**

This thing shows you how the risk changes over time. It also lets you compare places or time periods.. It helps identify patterns in what happened in the past with the **changes of risk with time**. This is really useful for understanding what is going on with the **changes of risk with time** and it helps to ** regions or periods** and to **identifies trends, on historical data**.

**Purpose:** assists **policy makers and scientists** in examining the **trends of outbreaks in the long term**.

----

### **ML Predictions (7-14 Days Ahead)**

Gathers data on **weather patterns**, **previous data on the disease** and monitors **weather indications**.

**Purpose:** this will give you a **head start on treatment** than waiting until it is too late to **respond**. The goal of this is to get a **head start on treatment**. Not **respond late** to the problem.

----

### **Water Quality Monitor**

This thing shows us a *map indicating the risk of water pollution**. When we move the mouse, over it a **hover popup indicates the states**. The **map indicating the risk of water pollution** is really important because it helps us see where the **water pollution** is a problem.

**Intent:** flags **water borne illnesses** such as **diarrhea, cholera and typhoid**.

----

### **Community Reporting**

I want to know about any ** observations** that people are making. This can be things, like **symptoms** that people are experiencing, the condition of the **water** or any other **environmental conditions** that seem unusual. People can share any kind of ** observations** they have no matter how small it may seem. If someone notices something about the **water** or **environmental conditions** I want to hear about it. Any **symptoms** that people are seeing or any other ** observations** are important to share.

**Value:** we have information that is going to help the models. This new information is something that we are working on now.

----

### **Healthcare Response Module**

This thing is, about ** medical readiness**. It also has to do with ** health services and emergency contacts**. The main idea is to know what to do for ** medical readiness** and how it connects to **regional health services and emergency contacts**.

**Purpose:** The main goal is to reduce the difference, between finding risks and doing something about them. This helps to fix the problem where we are not doing a job of detecting risks and then responding to them in a timely manner. The risk-detect-respond disjunction is an issue that needs to be addressed. By working on the risk-detect-respond disjunction we can make things better.

----

### **Favorite Locations**

You will have the ability to label places, like stores or restaurants with a colored badge. This badge will be saved on your phone and it will not be checked to make sure it is really you who is doing this. The colored badge you use to label high-profile locations will be stored on your phone and not authenticated.

**Application:** This is for keeping track of the risks in the places that're important to you like the risks in locations of interest, to you.

----

### **User Personalization**

**You can choose your city. Let it pick for you** and you will get **notifications, about what is happening in your city**. The things you like are saved in **LocalStorage** so you can use them again.

**Reason:** I want an experience, which will **preserve my privacy**. The main thing is that I get an experience and this will **preserve privacy**, for me.

----

### **Accessibility**

**Mobile, tablet and desktop performance**; **ARIA accessibility**; **high contrast risk indicators**; **fullkeyboard-support**.

**Pledge:** everyone should have ** access** to things. This means that the ** access** idea is really important. We need to make sure that ** access** is available, to everyone so that we are all treated the same. The *equal access** principle is what we should be aiming for.

----

### **Notifications (Telegram Bot)**

I found this really cool **Telegram bot** that tells you about **risk statuses**. It takes you **directly to the homepage of the dashboard**. This **Telegram bot** is pretty **small**. **Quick**. The best part is that it even works on **bandwidth devices**. I think this **Telegram bot** is really useful because it is **small** and **quick** and helps with **risk statuses**.

**Purpose:** I do not have to **open the app durability** every time to get a *push notification**. The main thing is that I can still get a *push notification**, without having to **open the app durability**. This way I can see my *push notification** easily.

----

## **Performance & Reliability**

- **API response caching**

- **Fewer redundant API calls**

- **Modular architecture**

- **Error tracking**

- **CI/CD workflows of stable migrations**

**Features:** scalable and **production ready**.

----

## **Planned & In-Progress**

- **Collected reporting (active development)**

- **More improved analytics visualisations**

- **Enhanced mobile UX**

- **Increased interaction with the medical sector**

This shows that the project was not completely over and the project is still changing. The project is really not dead. The project is very dynamic.

----

## **The Technology We Use. Why We Choose It**

- **Server-side rendering, Next.js (App Router) routing, APIs**

- **React – UI components**

- **A utility-based class of CSS, lightweight style**

- **Prisma – database ORM**

- The Telegram Bot API is used for messages on Telegram. Telegram Bot API messages are what we use to interact with the Telegram Bot API. We send messages. Receive messages using the Telegram Bot API. The Telegram Bot API messages are very useful, for communicating with users on Telegram.

- **LocalStorage – preferences**

- **Vercel - scalability, deployment on clouds**

----

## **Contributing Guidelines**

The repository is set up in a clean way and people do things the right way like testing, linting and commit hygiene. The repository really follows the practices and that is great to see. The best practices, like testing and linting and commit hygiene are really important, for the repository.

**Hazard:** helps people learn things when they are learning together. The idea of **learning ** is really important, to **Hazard**.

----

## **Overall Impact**

The dashboard offers things like:

* It has a lot of features

The dashboard is very useful because the dashboard has a lot of tools that people can use to do their work.

The dashboard is something that people look at every day to see what is going on with the dashboard.

- **Faster outbreak detection**

- **To improve health decision making**

- **Community engagement**

- **Local, state and national operation**

This thing is really important for the **Smart India Hackathon**. Also for **health programs**. It is also very useful for **Disaster preparedness systems**. The **Smart India Hackathon** and **health programs** and **Disaster preparedness systems** are all connected, to this.

----

## Deployed Website

https://epigaurd.vercel.app/

----

## **Short Demo Vedio **
