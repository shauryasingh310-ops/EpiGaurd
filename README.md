# **Disease Outbreak Dashboard**

---

## **Project Overview**

I am visiting the **Disease Outbreak Dashboard** that is the web portal that is based on providing **prior warnings** and **monitoring the outbreak of diseases in India**. It grabs **real-time data**, feeds it through **machine-learning to predict it** and allows **members of the community to post what they observe** so that **users, authorities and health planners** are able to make **decisions infected by data**.

---

## **Platform Focus**

- **Prevention (early alerts)**
![alt text](<Screenshot 2026-01-01 201053.png>)
- **Intervention (analytics and visual risk measures)**
![alt text](<Screenshot 2026-01-01 201110.png>)
- **Preparedness in response (insight and notification of health care)**
![alt text](<Screenshot 2026-01-01 201121.png>)

---

## **Quick Start (Development Setup)**

**Quick Start (Development Setup)** - a page that is used to ensure that you **run the project locally**.

---

## **Environment Variables (.env.local)**

You must make a file named **.env.local**, and put your **keys in this file**.

---

### **Required keys**

- **WEATHERAPIKEY** - retrieves **real time weather and environmental information** (humidity, rainfall, temperature, etc.) and **injects it into disease-risk estimations**.
- **OPENROUTERAPIKEY** - drives the **outbreak ML prediction in the server** (up to **714 days ahead**). It keeps on the **server as a backup** and **raw calls are never passed to the front -end**. The division makes the app **secure and scalable**.

---

## **Install & Run**

pnpm install
pnpm dev


After you have run **pnpm**, dependencies have been **downloaded**, and **pnpm dev is started**. The application is **local** and is available to be **tested and developed**.

---

## **API Endpoints**

The **API endpoints** that would power the dashboard are:

- **GET /api/disease-data** - retrieves the **most up-to-date disease-risk information**, including **state-level risk, maps, and analytics**.
- **GET /api/predictions** - rants more **rapid image reverse engineering of pre-computed outbreak prediction results** in the **cache**.
- **POST /api/predictions** - initiates the **ML-based prediction trigger** with the **OPENROUTERAPIKEY** which may be **fresh or pre-calculated** and the **costs are low**.

---

## **Defining Characteristics**

---

### **Live Risk Map**

It has an **interactive map displaying the risk of outbreaks per state** in **heatmap and colors**. Hover or click to see:

- **Risk intensity**
- **Affected regions**
- **Environmental factors**

Get this **real-time information on dangerous areas**.

---

### **Analytics Insights**

Show the **changes of risk with time**, allows you to **compare regions or periods**, and **identifies trends on historical data**.

**Purpose:** assists **policy makers and scientists** in examining the **trends of outbreaks in the long term**.

---

### **ML Predictions (7-14 Days Ahead)**

Gathers data on **weather patterns**, **previous data on the disease** and monitors **weather indications**.

**Purpose:** will provide you with a **head start on treatment** rather than **responding late**.

---

### **Water Quality Monitor**

It displays a **map indicating the risk of water pollution**; a **hover popup indicates the affected states**.

**Intent:** flags **water borne illnesses** such as **diarrhea, cholera and typhoid**.

---

### **Community Reporting**

Any type of **local observations** anyone may be making like, **symptoms, water, or environmental conditions**.

**Value:** new data which **contributes to the models**; is **currently under development**.

---

### **Healthcare Response Module**

Presents **local medical readiness** and relates to **regional health services and emergency contacts**.

**Purpose:** tapers off the **risk-detect-respond disjunction**.

---

### **Favorite Locations**

You will be in a position to **label high-profile locations with a colored badge**; it will be stored on your **mobile phone and not authenticated**.

**Application:** keep track of the **risks in locations of interest to you**.

---

### **User Personalization**

**Auto-picks or allows you to input your city/location** and receives the **notifications of that place**. Preferences are saved in **LocalStorage**.

**Reason:** customized experience, which will **preserve privacy**.

---

### **Accessibility**

**Mobile, tablet and desktop performance**; **ARIA accessibility**; **high contrast risk indicators**; **fullkeyboard-support**.

**Pledge:** everyone should have **equal access**.

---

### **Notifications (Telegram Bot)**

There is a **Telegram bot** that marks **risk statuses** and leads users **directly to the homepage of the dashboard**. It is **small, quick** and even works with **low-bandwidth devices**.

**Purpose:** do not have to **open the app durability** to receive a **push notification**.

---

## **Performance & Reliability**

- **API response caching**
- **Fewer redundant API calls**
- **Modular architecture**
- **Error tracking**
- **CI/CD workflows of stable migrations**

**Features:** scalable and **production ready**.

---

## **Planned & In-Progress**

- **Collected reporting (active development)**
- **More improved analytics visualisations**
- **Enhanced mobile UX**
- **Increased interaction with the medical sector**

This indicates that the project was **not quite dead and it is dynamic**.

---

## **Tech Stack (Why Each Is Used)**

- **Server-side rendering, Next.js (App Router) routing, APIs**
- **React – UI components**
- **A utility-based class of CSS, lightweight style**
- **Prisma – database ORM**
- **Telegram Bot API- messages**
- **LocalStorage – preferences**
- **Vercel - scalability, deployment on clouds**

---

## **Contributing Guidelines**

The repo is organized in a **clean manner**, and the **best practices** such as **testing, linting, and commit hygiene** are exercised.

**Hazard:** fosters **learning together**.

---

## **Overall Impact**

The dashboard offers:

- **Faster outbreak detection**
- **To improve health decision making**
- **Community engagement**
- **Local, state and national operation**

It particularly applies to the **Smart India Hackathon**, **health programs** and **Disaster preparedness systems**.

---

## Deployed Website

https://epigaurd.vercel.app/

---

## **Short Demo Vedio **



