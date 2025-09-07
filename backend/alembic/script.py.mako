"""
Alembic script configuration template.

This is a configuration file for Alembic, which is a database migration tool for SQLAlchemy.
"""
# A generic, single database configuration.

[alembic]
# Path to migration scripts
script_location = ${repr(script_location)}

# Template used to generate migration files
# file_template = %%(rev)s_%%(slug)s

# sys.path path, will be prepended to sys.path if present.
# Here we use the 'current directory' (where alembic.ini is) to find the 'alembic' directory
# (which is the same as script_location), and the 'app' directory (which contains our code).
prepend_sys_path = .

# Timezone to use when rendering the date within the migration file
# as well as the filename.
# If specified, requires the python-dateutil library that can be
# installed by adding --alembic-ini path/to/your/alembic.ini to your pip command
# string option is desired for accurate auto-generated migration filenames
# from the CLI.  If not specified, error is raised.
timezone = %(tzn)s

# Max length of characters to apply to the "slug" field
# truncate_slug_length = 40

# Set to 'true' to run the environment during
# the 'revision' command, regardless of autogenerate
# revision_environment = false

# Set to 'true' to allow .pyc and .pyo files without
# a source .py file to be detected as revisions in the
# versions/ directory
# sourceless = false

# Version location specification; This defaults
# to alembic/versions.  When using multiple version
# directories, initial revisions must be specified with --version-path
# version_locations = %(here)s/bar %(here)s/bat alembic/versions

# The output encoding used when revision files
# are written from script.py.mako
# output_encoding = utf-8

# SQLAlchemy URL - This will be overridden by the value in settings.py
sqlalchemy.url = ${repr(url)}


[post_write_hooks]
# Post-write hooks define scripts or Python functions that are run
# on newly generated revision scripts.  See the documentation for further
# detail and examples

# Format using "black"
python_files = black -l 79
# Format using "black"
# hooks = black
# black.type = console_scripts
# black.entrypoint = black
# black.options = -l 79

# Lint with flake8
# python_files = flake8
# Lint with flake8
# hooks = flake8
# flake8.type = console_scripts
# flake8.entrypoint = flake8
# flake8.options = --max-line-length=79

# Format using "black", then lint with flake8
# python_files = black -l 79 flake8
# hooks = black flake8
# black.type = console_scripts
# black.entrypoint = black
# black.options = -l 79
# flake8.type = console_scripts
# flake8.entrypoint = flake8
# flake8.options = --max-line-length=79

# Validate the revision file with mypy
# python_files = mypy
# hooks = mypy
# mypy.type = console_scripts
# mypy.entrypoint = mypy
# mypy.options = --disallow-untyped-defs --ignore-missing-imports

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
