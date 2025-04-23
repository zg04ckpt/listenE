using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    public partial class AddSegmentStartAndEndSec : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Segments");

            migrationBuilder.AddColumn<decimal>(
                name: "EndSec",
                table: "Segments",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "StartSec",
                table: "Segments",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndSec",
                table: "Segments");

            migrationBuilder.DropColumn(
                name: "StartSec",
                table: "Segments");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "Duration",
                table: "Segments",
                type: "time(6)",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }
    }
}
