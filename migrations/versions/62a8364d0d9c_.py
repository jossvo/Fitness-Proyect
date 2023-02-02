"""empty message

Revision ID: 62a8364d0d9c
Revises: a1e3fd608196
Create Date: 2023-02-02 18:12:03.424938

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '62a8364d0d9c'
down_revision = 'a1e3fd608196'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('date_of_birth', sa.Date(), nullable=False))
    op.add_column('user', sa.Column('share_age', sa.Boolean(), nullable=False))
    op.alter_column('user', 'alias',
               existing_type=sa.VARCHAR(length=250),
               nullable=True)
    op.alter_column('user', 'location',
               existing_type=sa.VARCHAR(length=250),
               nullable=True)
    op.alter_column('user', 'weight',
               existing_type=sa.VARCHAR(length=250),
               nullable=True)
    op.alter_column('user', 'height',
               existing_type=sa.VARCHAR(length=250),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('user', 'height',
               existing_type=sa.VARCHAR(length=250),
               nullable=False)
    op.alter_column('user', 'weight',
               existing_type=sa.VARCHAR(length=250),
               nullable=False)
    op.alter_column('user', 'location',
               existing_type=sa.VARCHAR(length=250),
               nullable=False)
    op.alter_column('user', 'alias',
               existing_type=sa.VARCHAR(length=250),
               nullable=False)
    op.drop_column('user', 'share_age')
    op.drop_column('user', 'date_of_birth')
    # ### end Alembic commands ###
