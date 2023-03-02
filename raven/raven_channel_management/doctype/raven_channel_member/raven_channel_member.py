# Copyright (c) 2023, Janhvi Patil and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from pypika import JoinType


class RavenChannelMember(Document):
    def validate(self):
        if not self.check_if_user_is_member():
            frappe.throw(
                "You don't have permission to add/modify members in this channel", frappe.PermissionError)

    def before_insert(self):
        # 1. A user cannot be a member of a channel more than once
        if frappe.db.exists("Raven Channel Member", {"channel_id": self.channel_id, "user_id": self.user_id}):
            frappe.throw("You are already a member of this channel",
                         frappe.DuplicateEntryError)

    def after_insert(self):
        frappe.publish_realtime('member_added', {
            'channel_id': self.channel_id}, after_commit=True)
        frappe.db.commit()

    def after_delete(self):
        frappe.publish_realtime('member_removed', {
            'channel_id': self.channel_id}, after_commit=True)
        frappe.db.commit()

    def on_trash(self):
        if not self.check_if_user_is_member():
            frappe.throw(
                "You don't have permission to remove members from this channel", frappe.PermissionError)

    def check_if_user_is_member(self):
        is_member = True
        channel = frappe.db.get_value("Raven Channel", self.channel_id, [
                                      "type", "owner"], as_dict=True)
        if channel.type == "Private":
            # A user can only add members to a private channel if they are themselves member of the channel or if they are the owner of a new channel
            if channel.owner == frappe.session.user and frappe.db.count("Raven Channel Member", {"channel_id": self.channel_id}) == 0:
                # User is the owner of a channel and there are no members in the channel
                pass
            elif frappe.db.exists("Raven Channel Member", {"channel_id": self.channel_id, "user_id": frappe.session.user}):
                # User is a member of the channel
                pass
            else:
                is_member = False
        return is_member


@frappe.whitelist()
def get_channel_members_and_data(channel_id):
    # fetch all channel members
    # get member details from user table, such as name, full_name, user_image, first_name
    channel_member = frappe.qb.DocType('Raven Channel Member')
    channel_data = frappe.qb.DocType('Raven Channel')
    user = frappe.qb.DocType('User')
    member_query = (frappe.qb.from_(channel_member)
                    .join(user, JoinType.left)
                    .on(channel_member.user_id == user.name)
                    .select(user.name, user.full_name, user.user_image, user.first_name)
                    .where(channel_member.channel_id == channel_id)
                    .where(channel_member.user_id != "administrator"))
    data_query = (frappe.qb.from_(channel_data)
                  .select(channel_data.name,
                          channel_data.channel_name,
                          channel_data.type,
                          channel_data.creation,
                          channel_data.owner,
                          channel_data.channel_description,
                          channel_data.is_direct_message,
                          channel_data.is_self_message)
                  .join(user, JoinType.left)
                  .on(channel_data.owner == user.name)
                  .select((user.full_name).as_('owner_full_name'))
                  .where(channel_data.name == channel_id))

    return {"channel_members": member_query.run(as_dict=True), "channel_data": data_query.run(as_dict=True)}
