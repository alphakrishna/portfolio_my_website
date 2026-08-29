# ARITech

A college project centered on **TeachAR**, an Augmented Reality (AR) based e-learning web application for immersive, practical-based learning. This repository bundles the application source together with the project's supporting materials (poster, reference paper, screenshots, demo video, and award photos).

## Repository Layout

```
ARITech/
├── TeachAR/                         # The main web application (Django project, own git repo)
├── Winner/                          # Award / recognition photos
├── ARITech poster.docx             # Project poster (Word source)
├── ARITech poster.pdf              # Project poster (PDF)
├── ARITech poster.pdf.docx         # Poster (duplicate/variant)
├── S1793351X19400154.pdf           # Reference research paper
├── Screenshot 2023-03-01 140059.png    # Application / demo screenshots
├── Screenshot 2023-03-01 142715.png
├── Screenshot 2023-03-01 144350.png
├── Screenshot 2023-03-28 121503.png
└── WhatsApp Video 2023-03-02 at 4.26.00 AM.mp4   # Demo video
```

> Note: `TeachAR/` contains its own `.git` directory (originally cloned from
> `https://github.com/omkar3602/TeachAR.git`), so it is effectively a nested/embedded repository.

## The TeachAR Application

TeachAR is a **Django 4.1** web application. Users browse subjects and topics; each topic links
to an AR effect that can be triggered by scanning a printed "target image". The app also lets a
logged-in user email an AR effect link to someone else, and it can generate QR codes for effects.

### Tech Stack

| Layer      | Technology                                            |
|------------|-------------------------------------------------------|
| Backend    | Python 3.x, Django 4.1.2                              |
| Database   | SQLite (`db.sqlite3`)                                 |
| Frontend   | Django templates, Bootstrap 4, jQuery, Font Awesome, Poppins font |
| Media      | Pillow (image handling), PyQRCode + pypng (QR codes)  |
| Email      | Python `smtplib` over Gmail SMTP                      |
| AR effects | External hosted effects (e.g. Zappar), triggered by target-image scans |

Dependencies (`TeachAR/requirements.txt`): `asgiref`, `Django==4.1.2`, `Pillow`, `pypng`,
`PyQRCode`, `sqlparse`, `tzdata`.

### Project Structure

```
TeachAR/
├── manage.py                 # Django management entry point
├── db.sqlite3                # SQLite database (checked in)
├── requirements.txt
├── README.md                 # App-specific setup instructions
├── LICENSE
├── TeachAR/                  # Project settings package
│   ├── settings.py           # Settings (custom user model, media config, etc.)
│   ├── urls.py               # Root URL routing
│   ├── asgi.py / wsgi.py
├── mainapp/                  # Core app: subjects, topics, email sharing
│   ├── models.py             # Subject, Topic
│   ├── views.py              # index, subject, send_email
│   ├── urls.py
│   ├── admin.py
│   ├── migrations/
│   └── templates/mainapp/    # base.html, index.html, subject/subject.html
├── userauth/                 # Authentication app (custom user model)
│   ├── models.py             # Account (AbstractBaseUser) + MyAccountManager
│   ├── views.py              # login, signup, logout
│   ├── urls.py
│   ├── admin.py
│   ├── migrations/
│   └── templates/userauth/   # base.html, login.html, signup.html
├── utils/                    # Helper utilities
│   ├── decorator.py          # login_required_message decorator
│   ├── email_sender.py       # send_mail via Gmail SMTP
│   └── qrcode_generator.py   # generate_qr via PyQRCode
├── static/images/            # Logo, banner, carousel images
├── media/                    # Uploaded content
│   ├── subjects/             # Subject cover images
│   └── topics/               # Topic images + qr_codes/
└── target_images/            # Scannable AR target images, by subject
    ├── Biology/  Chemistry/  Maths/  Physics/
```

### Data Model

- **Subject** (`mainapp/models.py`): `name` (unique), `tagline`, `image`.
- **Topic** (`mainapp/models.py`): `name`, `subject` (FK → Subject), `link` (AR effect URL),
  `qr_code` (image), `image`.
- **Account** (`userauth/models.py`): custom user model extending `AbstractBaseUser`, with a
  `MyAccountManager`. Login field is `username`; also stores `name`, `email`, and the standard
  admin/staff/active flags. Configured via `AUTH_USER_MODEL = 'userauth.Account'`.

### URL Routes

| Path                     | View                 | Name          |
|--------------------------|----------------------|---------------|
| `/`                      | `mainapp.index`      | `home`        |
| `/subject/<name>`        | `mainapp.subject`    | `subject`     |
| `/send_email`            | `mainapp.send_email` | `send_email`  |
| `/auth/login/`           | `userauth.login_user`| `login`       |
| `/auth/signup/`          | `userauth.signup`    | `signup`      |
| `/auth/logout/`          | `userauth.logout_user`| `logout`     |
| `/admin/`                | Django admin         | —             |

Media files are served at `/media/` in development.

### Key Behaviors

- The home page shows a marketing carousel to anonymous users and a subject grid to logged-in users.
- Viewing a subject's topics requires login (enforced by `login_required` plus a custom
  `login_required_message` decorator that flashes a message).
- `send_email` composes a multipart (plain + HTML) message and sends it via Gmail SMTP to invite
  someone to view an AR effect.
- QR codes for effect links are generated with PyQRCode.

## Getting Started

From inside the `TeachAR/` directory:

```bash
# 1. (Recommended) create and activate a virtual environment
python -m venv venv
# Windows: venv\Scripts\activate   |   macOS/Linux: source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the development server
python manage.py runserver
```

The site runs at http://localhost:8000/. To use the AR effects, scan the images in the
`target_images/` folder with the corresponding AR effect.

### Test Credentials (from the app README)

- **Admin** — username: `admin`, password: `1234`
- **User** — username: `omkar`, password: `1234`

## Supporting Materials

- **Poster:** `ARITech poster.pdf` / `.docx`
- **Reference paper:** `S1793351X19400154.pdf`
- **Screenshots:** the four `Screenshot *.png` files
- **Demo video:** `WhatsApp Video 2023-03-02 at 4.26.00 AM.mp4`
- **Award photos:** `Winner/` (this project won recognition)

## Security Notes (for maintainers)

This is a student/demo project and is **not hardened for production**. Before any real deployment:

- The Django `SECRET_KEY` is committed in `TeachAR/settings.py` and `DEBUG = True` — rotate the key
  and disable debug.
- Gmail SMTP credentials (an app password) are hard-coded in `utils/email_sender.py` — move these
  to environment variables and revoke the exposed password.
- `db.sqlite3` and uploaded media are committed to the repo.
- Test credentials are documented publicly in the app README.
```
