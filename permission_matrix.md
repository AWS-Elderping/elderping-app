# ElderPing Platform Permission Matrix

This document provides a matrix of roles and permission scopes mapped against protected API endpoints across all services in the platform.

## Mapped Roles (In-Memory Aliases)
* **USER** (Legacy: `ELDER`)
* **CAREGIVER** (Legacy: `FAMILY`)
* **ADMIN**
* **SUPER_ADMIN**

---

## Permission Mapping Matrix

| Microservice | Endpoint | Method | Required Scope / Role Check | USER | CAREGIVER | ADMIN | SUPER_ADMIN |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **Auth** | `/me` | GET | `authenticate()` | Yes | Yes | Yes | Yes |
| **Auth** | `/link` | POST | `authenticate()` (Caregiver only) | No | Yes | Yes | Yes |
| **Auth** | `/links/elders` | GET | `authenticate()` (Caregiver only) | No | Yes | Yes | Yes |
| **Auth** | `/links/family` | GET | `authenticate()` (Elder only) | Yes | No | Yes | Yes |
| **Auth** | `/contacts/:elderId` | GET/POST | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Auth** | `/consents/:elderId` | GET/POST | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Auth** | `/admin/users` | GET | `requirePermission('USER_MANAGE')` | No | No | Yes | Yes |
| **Auth** | `/admin/users/:id` | GET | `requirePermission('USER_MANAGE')` | No | No | Yes | Yes |
| **Auth** | `/admin/users/:id/role` | PATCH | `requirePermission('USER_MANAGE')` | No | No | Yes | Yes |
| **Auth** | `/admin/users/:id/status` | PATCH | `requirePermission('USER_MANAGE')` | No | No | Yes | Yes |
| **Health** | `/checkin` | POST | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Health** | `/vitals` | POST | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Health** | `/vitals/:userId` | GET | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Health** | `/vitals/trends/:userId` | GET | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Health** | `/documents/upload` | POST | `authenticate()` + Local Relationship | Own | Mapped | Yes | Yes |
| **Health** | `/documents/:elderId` | GET | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Health** | `/documents/download/:docId`| GET | `authenticate()` + Local Relationship | Own | Mapped | Yes | Yes |
| **Health** | `/documents/:docId` | DELETE | `authenticate()` + Local Relationship | Own | Mapped | Yes | Yes |
| **Health** | `/timeline/:elderId` | GET | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Health** | `/dashboard/elder/:elderId` | GET | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Health** | `/dashboard/family/:elderId` | GET | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Appointment** | `/appointments` | POST | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Appointment** | `/appointments/elder/:elderId`| GET | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Appointment** | `/appointments/upcoming/:elderId`| GET | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Appointment** | `/appointments/search/:elderId`| GET | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Appointment** | `/appointments/:id` | PUT | `authenticate()` + Local check | Own | Mapped | Yes | Yes |
| **Appointment** | `/appointments/:id/complete`| PUT | `authenticate()` + Local check | Own | Mapped | Yes | Yes |
| **Appointment** | `/appointments/:id/cancel` | PUT | `authenticate()` + Local check | Own | Mapped | Yes | Yes |
| **Appointment** | `/appointments/:id/missed` | PUT | `authenticate()` + Local check | Own | Mapped | Yes | Yes |
| **Appointment** | `/doctors` | POST | `requirePermission('APPOINTMENT_MANAGE')`| No | No | Yes | Yes |
| **Appointment** | `/hospitals` | POST | `requirePermission('APPOINTMENT_MANAGE')`| No | No | Yes | Yes |
| **Reminder** | `/reminders` | POST | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Reminder** | `/reminders/:userId` | GET | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Reminder** | `/reminders/:id/take` | PUT | `authenticate()` + Local check | Own | Mapped | Yes | Yes |
| **Reminder** | `/reminders/:userId/compliance`| GET | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Reminder** | `/compliance/stats/:userId` | GET | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Reminder** | `/inventory` | POST | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Reminder** | `/inventory/:userId` | GET | `authenticate()` + `checkRelationship` | Own | Mapped | Yes | Yes |
| **Notification** | `/notifications/logs` | GET | `requirePermission('NOTIFICATION_READ')` | No | No | Yes | Yes |
| **Audit** | `/audit` | GET | `requirePermission('AUDIT_READ')` | No | No | Yes | Yes |
| **FinOps** | `/finops/dashboard` | GET | `requireRole('SUPER_ADMIN')` | No | No | No | Yes |
| **FinOps** | `/finops/recommendations` | GET | `requireRole('SUPER_ADMIN')` | No | No | No | Yes |
| **FinOps** | `/finops/recommendations/:id/apply`| POST | `requireRole('SUPER_ADMIN')` | No | No | No | Yes |
| **FinOps** | `/finops/costs` | POST | `requireRole('SUPER_ADMIN')` | No | No | No | Yes |

* **Own**: Allowed only for the User (Elder) resource matching their logged-in User ID.
* **Mapped**: Allowed for the Caregiver (Family) only if a valid Relationship link exists in `family_links`.
